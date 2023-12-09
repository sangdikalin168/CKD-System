import {
    Arg,
    Field,
    InterfaceType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { TrainningPayment } from "../Entities/TrainningPayment";

@InterfaceType()
export abstract class TrainningPaymentResponse {

    @Field()
    payment_id: number;

    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: TrainningPaymentResponse })
export class TrainningPaymentMutationResponse implements TrainningPaymentResponse {
    payment_id: number;
    code: number;
    success: boolean;
    message?: string;
}



@Resolver()
export class TranningPaymentResolver {

    @Query((_return) => [TrainningPayment])
    async GetTrainningPayment(@Arg("customer_id") customer_Id: number): Promise<TrainningPayment[]> {
        return await TrainningPayment.find({ where: { customer_id: customer_Id } });
    }

    @Mutation((_return) => TrainningPaymentMutationResponse)
    async CreateTrainningPayment(
        @Arg("user_id") user_id: number,
        @Arg("customer_id") customer_id: number,
        @Arg("promotion") promotion: string,
        @Arg("price") price: number,
        @Arg("type") type: string,
    ): Promise<TrainningPaymentMutationResponse> {
        const result = await TrainningPayment.create({
            user_id: user_id,
            customer_id: customer_id,
            promotion: promotion,
            price: price,
            type: type,
        }).save();

        if (result.payment_id) {
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
}