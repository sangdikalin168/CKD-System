import { MemberPayment } from "../Entities/MemberPayment";
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
import { Users } from "../Entities/Users";
import { Between } from "typeorm";
import moment from "moment";
import { Purchase } from "../Entities/Purchase";
import { ProductType, Shift } from "../Entities/enums";
import { findOrCreateTimePackage, upsertTimeEntitlement } from "../Utils/access";

@ObjectType()
export class MemberPaymentMutationResponse extends PaymentMutationResponseBase {}


@ObjectType()
class MemberPaymentDetail {
    @Field()
    payment_id: number;

    @Field()
    payment_date: Date

    @Field()
    display_name: string

    @Field()
    customer_name: string

    @Field()
    phone: string

    @Field()
    promotion: string

    @Field()
    price: number

    @Field()
    start_date: Date

    @Field()
    old_end: Date

    @Field()
    new_end: Date
}

@Resolver()
export class MemberPaymentResolver {

    @UseMiddleware(checkAuth)
    @Query((_return) => [MemberPayment])
    async GetMemberPayment(@Arg("customer_id") customer_Id: number): Promise<MemberPayment[]> {
        return await MemberPayment.find({ where: { customer_id: customer_Id } });
    }

    @UseMiddleware(checkAuth)
    @Query((_return) => MemberPaymentDetail)
    async MemberPaymentDetail(@Arg("payment_id") payment_id: number) {
        const res = await MemberPayment.createQueryBuilder("member_payment")
            .innerJoin(Users, "user", "member_payment.user_id = user.user_id")
            .innerJoin(Customer, "customer", "member_payment.customer_id = customer.customer_id")
            .select(["payment_id", "payment_date", "user.display_name as display_name", "customer_name", "customer.phone as phone", "promotion", "price", "old_end", "new_end", "start_date"])
            .where("payment_id = :payment_id", { payment_id: payment_id })
            .getRawOne();
        return res;
    }

    @UseMiddleware(checkAuth)
    @Mutation((_return) => MemberPaymentMutationResponse)
    async CreateCustomerPayment(
        @Arg("user_id") user_id: number,
        @Arg("customer_id") customer_id: number,
        @Arg("promotion") promotion: string,
        @Arg("price") price: number,
        @Arg("old_end") old_end: string,
        @Arg("new_end") new_end: string,
        @Arg("start_date") start_date: string,
        @Arg("shift") shift: string,
        @Arg("month_qty") month_qty: number,
    ): Promise<MemberPaymentMutationResponse> {
        const current_date = moment().format('YYYY-MM-DD');

        const isDuplicate = await MemberPayment.findBy({
            payment_date: Between(new Date(current_date + ' 00:00:00'), new Date(current_date + ' 23:00:00')),
            customer_id: customer_id
        })

        if (isDuplicate.length > 0) {
            //Return Failed
            return {
                payment_id: 0,
                code: 400,
                success: false,
                message: "Duplicated",
            };
        }

        const result = await MemberPayment.create({
            user_id: user_id,
            customer_id: customer_id,
            promotion: promotion,
            price: price,
            old_end: old_end,
            new_end: new_end,
            start_date: start_date,
            shift: shift,
            month_qty: month_qty
        }).save();

        if (result.payment_id) {
            const update = await Customer.update({
                customer_id: customer_id,
            }, {
                end_membership_date: new_end,
                shift: shift,
            })

            if (update.affected) {
                // Dual-write to the unified model: record the money (Purchase) and
                // create/extend the membership Entitlement. Best-effort — a hiccup
                // here must not fail the existing (invoice-bearing) flow.
                try {
                    const shiftVal = shift === "Morning" ? Shift.Morning : Shift.Full;
                    const pkg = await findOrCreateTimePackage({
                        name: promotion || "Membership",
                        product_type: ProductType.MEMBERSHIP,
                        price: price,
                        duration_months: month_qty,
                        grants_door_access: true,
                    });
                    // Entitlement FIRST so a failure here never leaves an orphan Purchase.
                    const ent = await upsertTimeEntitlement({
                        customer_id: customer_id,
                        package_id: pkg.package_id,
                        product_type: ProductType.MEMBERSHIP,
                        valid_from: start_date,
                        valid_until: new_end,
                        shift: shiftVal,
                    });
                    const purchase = await Purchase.create({
                        customer_id: customer_id,
                        package_id: pkg.package_id,
                        sold_by: user_id,
                        price_paid: price,
                        discount_amount: 0,
                        promotion: promotion,
                        shift: shiftVal,
                        applies_from: start_date,
                        applies_until: new_end,
                        previous_valid_until: old_end,
                        entitlement_id: ent.entitlement_id,
                    }).save();
                    if (!ent.origin_purchase_id) {
                        ent.origin_purchase_id = purchase.purchase_id;
                        await ent.save();
                    }
                } catch (e) {
                    console.error("Unified-model dual-write failed (member payment):", e);
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