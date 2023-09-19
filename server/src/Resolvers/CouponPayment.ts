import {
    Arg,
    Field,
    InterfaceType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { CouponPayment } from "../Entities/CouponPayment";
import { CouponCard } from "../Entities/CouponCard";

@InterfaceType()
export abstract class CouponPaymentResponse {

    @Field()
    payment_id: number;

    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: CouponPaymentResponse })
export class CouponPaymentMutationResponse implements CouponPaymentResponse {
    payment_id: number;
    code: number;
    success: boolean;
    message?: string;
}

@Resolver()
export class CouponPaymentResolver {

    @Query((_return) => [CouponPayment])
    async GetCouponPayment(@Arg("customer_id") customer_Id: number): Promise<CouponPayment[]> {
        return await CouponPayment.find({ where: { customer_id: customer_Id } });
    }

    @Mutation((_return) => CouponPaymentMutationResponse)
    async CreateCouponPayment(
        @Arg("user_id") user_id: number,
        @Arg("customer_id") customer_id: number,
        @Arg("card_name") card_name: string,
        @Arg("price") price: number,
        @Arg("quantity") quantity: number,
        @Arg("coupon_code") coupon_code: string,
    ): Promise<CouponPaymentMutationResponse> {

        const result = await CouponPayment.create({
            user_id: user_id,
            customer_id: customer_id,
            card_name: card_name,
            price: price,
            quantity: quantity,
            coupon_code: coupon_code
        }).save();

        if (result.payment_id) {
            const update = await CouponCard.update({
                coupon_code: coupon_code,
            }, {
                status: "Sold"
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