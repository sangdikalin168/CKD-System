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
import { FruitPayment } from "../Entities/FruitPayment";

@InterfaceType()
export abstract class FruitPaymentResponse {

    @Field()
    payment_id: number;

    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: FruitPaymentResponse })
export class FruitPaymentMutationResponse implements FruitPaymentResponse {
    payment_id: number;
    code: number;
    success: boolean;
    message?: string;
}

@Resolver()
export class FruitPaymentResolver {

    @Query((_return) => [FruitPayment])
    async GetFruitPayment(@Arg("customer_id") customer_Id: number): Promise<FruitPayment[]> {
        return await FruitPayment.find({ where: { customer_id: customer_Id } });
    }

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