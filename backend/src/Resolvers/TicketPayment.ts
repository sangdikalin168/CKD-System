import {
    Arg,
    Field,
    InterfaceType,
    Mutation,
    ObjectType,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { checkAuth } from "../MiddleWare/checkAuth";
import { TicketPayment } from "../Entities/TicketPayment";
import { TicketPriceConfig } from "../Entities/TicketPriceConfig";
import { Purchase } from "../Entities/Purchase";
import { findOrCreateTicketPackage, createTicketEntitlement } from "../Utils/access";
import { PaymentMutationResponseBase } from "../Types/PaymentMutationResponse";

@ObjectType()
export class TicketPaymentMutationResponse extends PaymentMutationResponseBase {}

@Resolver()
export class TicketPaymentResolver {

    @UseMiddleware(checkAuth)
    @Mutation((_return) => TicketPaymentMutationResponse)
    async CreateTicketPayment(
        @Arg("user_id") user_id: number,
        @Arg("price") price: number,
        @Arg("ticket_code") ticket_code: string,
    ): Promise<TicketPaymentMutationResponse> {
        // Auto-lookup facilities from admin config — cashier never picks manually.
        const config = await TicketPriceConfig.findOne({ where: { price } });
        const facilityIds = config?.facilities?.map((f) => f.facility_id) ?? [];

        const result = await TicketPayment.create({
            user_id: user_id,
            ticket_code: ticket_code,
            price: price,
        }).save();

        if (result.payment_id) {
            // Create one entitlement per facility (multi-facility tickets supported).
            for (const facility_id of facilityIds) {
                try {
                    const pkg = await findOrCreateTicketPackage(price, facility_id);
                    const ent = await createTicketEntitlement({
                        package_id: pkg.package_id,
                        access_code: ticket_code,
                    });
                    const purchase = await Purchase.create({
                        package_id: pkg.package_id,
                        sold_by: user_id,
                        price_paid: facilityIds.length > 1 ? 0 : price,
                        discount_amount: 0,
                        entries_added: 1,
                        entitlement_id: ent.entitlement_id,
                        note: `ticket:${ticket_code}`,
                    }).save();
                    ent.origin_purchase_id = purchase.purchase_id;
                    await ent.save();
                } catch (e) {
                    console.error("Unified-model dual-write failed (ticket):", e);
                }
            }

            return {
                payment_id: result.payment_id,
                code: 200,
                success: true,
                message: "Ticket Insert Success",
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
