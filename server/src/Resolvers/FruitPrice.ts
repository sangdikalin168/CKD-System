import { FruitPrice } from "../Entities/FruitPrice";
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
export abstract class FruitPriceTableResponse {
    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: FruitPriceTableResponse })
export class FruitPriceTableMutationResponse implements FruitPriceTableResponse {
    code: number;
    success: boolean;
    message?: string;
}


@Resolver()
export class FruitPriceResolver {
    @Query((_return) => [FruitPrice])
    async GetFruitPriceTable(): Promise<FruitPrice[]> {
        return await FruitPrice.find({ order: { id: "ASC" } });
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