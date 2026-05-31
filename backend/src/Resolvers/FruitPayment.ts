import { Customer } from "../Entities/Customer";
import {
    Arg,
    Field,
    InterfaceType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { checkAuth } from "../MiddleWare/checkAuth";
import { PaymentMutationResponseBase } from "../Types/PaymentMutationResponse";
import { FruitPayment } from "../Entities/FruitPayment";
import { Purchase } from "../Entities/Purchase";
import { ProductType } from "../Entities/enums";
import { findOrCreateTimePackage, upsertTimeEntitlement } from "../Utils/access";
import { Between } from "typeorm";
import moment from "moment";

@ObjectType()
export class FruitPaymentMutationResponse extends PaymentMutationResponseBase {}

@Resolver()
export class FruitPaymentResolver {

    @UseMiddleware(checkAuth)
    @Query((_return) => [FruitPayment])
    async GetFruitPayment(@Arg("customer_id") customer_Id: number): Promise<FruitPayment[]> {
        return await FruitPayment.find({ where: { customer_id: customer_Id } });
    }

    @UseMiddleware(checkAuth)
    @Mutation((_return) => FruitPaymentMutationResponse)
    async CreateFruitPayment(
        @Arg("user_id") user_id: number,
        @Arg("customer_id") customer_id: number,
        @Arg("promotion") promotion: string,
        @Arg("price") price: number,
        @Arg("old_end") old_end: string,
        @Arg("new_end") new_end: string,
        @Arg("month_qty") month_qty: number,
    ): Promise<FruitPaymentMutationResponse> {

        // Same-day duplicate guard (mirrors CreateCustomerPayment) — prevents a
        // retry from creating duplicate fruit payments + duplicate dual-writes.
        const current_date = moment().format('YYYY-MM-DD');
        const isDuplicate = await FruitPayment.findBy({
            payment_date: Between(new Date(current_date + ' 00:00:00'), new Date(current_date + ' 23:00:00')),
            customer_id: customer_id,
        });
        if (isDuplicate.length > 0) {
            return {
                payment_id: 0,
                code: 400,
                success: false,
                message: "Duplicated",
            };
        }

        const result = await FruitPayment.create({
            user_id: user_id,
            customer_id: customer_id,
            promotion: promotion,
            price: price,
            old_end: old_end,
            new_end: new_end,
            month_qty: month_qty
        }).save();

        if (result.payment_id) {
            const update = await Customer.update({
                customer_id: customer_id,
            }, {
                end_fruit_date: new_end,
            })

            if (update.affected) {
                // Dual-write to the unified model (Fruit = product_type FRUIT).
                try {
                    const today = moment().format('YYYY-MM-DD');
                    const pkg = await findOrCreateTimePackage({
                        name: promotion || "Fruit",
                        product_type: ProductType.FRUIT,
                        price: price,
                        duration_months: month_qty,
                        grants_door_access: false,
                    });
                    // Entitlement FIRST so a failure here never leaves an orphan Purchase.
                    const ent = await upsertTimeEntitlement({
                        customer_id: customer_id,
                        package_id: pkg.package_id,
                        product_type: ProductType.FRUIT,
                        valid_from: today,
                        valid_until: new_end,
                    });
                    const purchase = await Purchase.create({
                        customer_id: customer_id,
                        package_id: pkg.package_id,
                        sold_by: user_id,
                        price_paid: price,
                        discount_amount: 0,
                        promotion: promotion,
                        applies_from: today,
                        applies_until: new_end,
                        previous_valid_until: old_end,
                        entitlement_id: ent.entitlement_id,
                    }).save();
                    if (!ent.origin_purchase_id) {
                        ent.origin_purchase_id = purchase.purchase_id;
                        await ent.save();
                    }
                } catch (e) {
                    console.error("Unified-model dual-write failed (fruit payment):", e);
                }

                return {
                    payment_id: result.payment_id,
                    code: 200,
                    success: true,
                    message: "Update Member Success",
                };
            }

            //Return Failed
            return {
                payment_id: 0,
                code: 200,
                success: false,
                message: "Invoice Create Failed",
            };
        }

        //Return Failed
        return {
            payment_id: 0,
            code: 200,
            success: false,
            message: "Invoice Create Failed",
        };

    }
}