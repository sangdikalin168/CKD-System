import { TrainningPrice } from "../Entities/TrainningPrice";
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
export abstract class TranningPriceResponse {
    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: TranningPriceResponse })
export class TranningPriceMutationResponse implements TranningPriceResponse {
    code: number;
    success: boolean;
    message?: string;
}



@Resolver()
export class TranningPriceResolver {
    @Query((_return) => [TrainningPrice])
    async GetTranningPrice(): Promise<TrainningPrice[]> {
        return await TrainningPrice.find({ order: { id: "ASC" } });
    }

    // @Mutation((_return) => CustomerMutationResponse)
    // async CreateCustomer(
    //     @Arg("customer_name") customer_name: string,
    //     @Arg("phone") phone: string,
    //     @Arg("gender") gender: string,
    //     @Arg("created_by") created_by: number,
    // ): Promise<CustomerMutationResponse> {
    //     const isExist = await Customer.findOne({
    //         where: [{ customer_name: customer_name }, { phone: phone }],
    //     });

    //     if (isExist) {
    //         return {
    //             code: 400,
    //             success: false,
    //             message: "Already Exist",
    //         };
    //     }
    //     await Customer.create({
    //         customer_name: customer_name,
    //         phone: phone,
    //         gender: gender,
    //         created_by: created_by
    //     }).save();

    //     return {
    //         code: 200,
    //         success: true,
    //         message: "Create Success",
    //     };
    // }
}