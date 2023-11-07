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
import { Users } from "../Entities/Users";

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
    old_end: Date

    @Field()
    new_end: Date
}

@Resolver()
export class MemberPaymentResolver {

    @Query((_return) => [MemberPayment])
    async GetMemberPayment(@Arg("customer_id") customer_Id: number): Promise<MemberPayment[]> {
        return await MemberPayment.find({ where: { customer_id: customer_Id } });
    }

    @Query((_return) => MemberPaymentDetail)
    async MemberPaymentDetail(@Arg("payment_id") payment_id: number) {
        const res = await MemberPayment.createQueryBuilder("member_payment")
            .innerJoin(Users, "user", "member_payment.user_id = user.user_id")
            .innerJoin(Customer, "customer", "member_payment.customer_id = customer.customer_id")
            .select(["payment_id", "payment_date", "user.display_name as display_name", "customer_name", "customer.phone as phone", "promotion", "price", "old_end", "new_end"])
            .where("payment_id = :payment_id", { payment_id: payment_id })
            .getRawOne();
        return res;
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