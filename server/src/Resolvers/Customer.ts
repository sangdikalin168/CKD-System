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
import * as fs from "fs";
import * as path from "path";

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

    @Mutation((_return) => CustomerMutationResponse)
    async UpdateCustomerPhoto(
        @Arg("customer_id") customer_id: number,
        @Arg("image_path") image_path: string,
    ): Promise<CustomerMutationResponse> {
        try {
            const customer = await Customer.findOne({ where: { customer_id } });
            
            if (!customer) {
                return {
                    code: 404,
                    success: false,
                    message: "Customer not found",
                };
            }

            // Create uploads directory if it doesn't exist
            const uploadsDir = path.join(__dirname, "../../uploads/members");
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            // Generate unique filename
            const fileName = `member_${customer_id}_${Date.now()}.jpg`;
            const filePath = path.join(uploadsDir, fileName);

            // Extract base64 data and save to file
            const base64Data = image_path.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, "base64");
            fs.writeFileSync(filePath, buffer);

            // Delete old image if exists
            if (customer.image_path && customer.image_path.startsWith("/uploads/")) {
                const oldFilePath = path.join(__dirname, "../../", customer.image_path);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }

            // Store relative path in database
            const dbPath = `/uploads/members/${fileName}`;
            const update = await Customer.update(
                { customer_id },
                { image_path: dbPath }
            );

            if (update.affected) {
                return {
                    code: 200,
                    success: true,
                    message: "Photo updated successfully",
                };
            }

            return {
                code: 400,
                success: false,
                message: "Failed to update photo",
            };
        } catch (error) {
            console.error("Error updating photo:", error);
            return {
                code: 500,
                success: false,
                message: "Server error",
            };
        }
    }
}