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
export abstract class ICustomerResponse {
    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: ICustomerResponse })
export class CustomerMutationResponse implements ICustomerResponse {
    code: number;
    success: boolean;
    message?: string;
}



@Resolver()
export class CustomerResolver {
    @Query((_return) => [Customer])
    async GetCustomers(): Promise<Customer[]> {
        return await Customer.find({ order: { customer_id: "DESC" } });
    }

    @Query((_return) => [Customer])
    async GetCustomerDetail(@Arg("customer_id") customer_Id: number): Promise<Customer[]> {
        return await Customer.find({ where: { customer_id: customer_Id } });
    }


    @Mutation((_return) => CustomerMutationResponse)
    async CreateCustomer(
        @Arg("customer_name") customer_name: string,
        @Arg("phone") phone: string,
        @Arg("gender") gender: string,
        @Arg("created_by") created_by: number,
    ): Promise<CustomerMutationResponse> {
        const isExist = await Customer.findOne({
            where: [{ customer_name: customer_name }, { phone: phone }],
        });

        if (isExist) {
            return {
                code: 400,
                success: false,
                message: "Already Exist",
            };
        }
        await Customer.create({
            customer_name: customer_name,
            phone: phone,
            gender: gender,
            created_by: created_by
        }).save();

        return {
            code: 200,
            success: true,
            message: "Create Success",
        };
    }

    @Mutation((_return) => CustomerMutationResponse)
    async UpdateCustomer(
        @Arg("customer_id") customer_id: number,
        @Arg("phone") phone: string,
    ): Promise<CustomerMutationResponse> {

        const existPhone = await Customer.findOne({ where: { phone: phone } })

        if (existPhone?.customer_id) {
            return {
                code: 200,
                success: false,
                message: "លេខនេះមានរួចហើយ!!!",
            };
        }

        const update = await Customer.update({
            customer_id: customer_id,
        }, {
            phone: phone
        })
        if (update.affected) {
            return {
                code: 200,
                success: true,
                message: "Update Member Success",
            };
        }
        //Return Failed
        return {
            code: 200,
            success: false,
            message: "Update Member Failed",
        };
    }
}