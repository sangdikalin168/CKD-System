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
} from "type-graphql";

@InterfaceType()
export abstract class MemberPaymentResponse {

    @Field()
    payment_id: number;

    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: MemberPaymentResponse })
export class MemberPaymentMutationResponse implements MemberPaymentResponse {
    payment_id: number;
    code: number;
    success: boolean;
    message?: string;
}

@Resolver()
export class MemberPaymentResolver {

    @Query((_return) => [MemberPayment])
    async GetMemberPayment(@Arg("customer_id") customer_Id: number): Promise<MemberPayment[]> {
        return await MemberPayment.find({ where: { customer_id: customer_Id } });
    }

    @Mutation((_return) => MemberPaymentMutationResponse)
    async CreateCustomerPayment(
        @Arg("user_id") user_id: number,
        @Arg("customer_id") customer_id: number,
        @Arg("promotion") promotion: string,
        @Arg("price") price: number,
        @Arg("old_end") old_end: string,
        @Arg("new_end") new_end: string,
        @Arg("shift") shift: string,
        @Arg("month_qty") month_qty: number,
    ): Promise<MemberPaymentMutationResponse> {

        const result = await MemberPayment.create({
            user_id: user_id,
            customer_id: customer_id,
            promotion: promotion,
            price: price,
            old_end: old_end,
            new_end: new_end,
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