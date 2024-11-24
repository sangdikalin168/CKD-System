import { Between, MoreThan } from "typeorm";
import { Customer } from "../Entities/Customer";
import { Arg, Field, Int, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
class ActiveCustomerReport {
    @Field(() => Int)
    total!: number;

    @Field(() => [Customer])
    customers!: Customer[];
}

@ObjectType()
class ExpiringCustomerReport {
    @Field(() => Int)
    total!: number;

    @Field(() => [Customer])
    customers!: Customer[];
}

@Resolver()
export class CustomerReportResolver {
    @Query(() => ActiveCustomerReport)
    async activeCustomers(): Promise<ActiveCustomerReport> {
        try {
            const currentDate = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' format

            // Find customers with end_membership_date greater than the current date
            const customers = await Customer.find({
                where: {
                    end_membership_date: MoreThan(currentDate), // Ensure the membership is still active
                },
            });

            // Count total active customers
            const total = await Customer.count({
                where: {
                    end_membership_date: MoreThan(currentDate),
                },
            });

            return {
                total,
                customers,
            };
        } catch (error) {
            console.error("Error fetching active customers:", error);
            throw new Error("Failed to fetch active customers");
        }
    }

    // Query for customers expiring on a specific date
    @Query(() => ExpiringCustomerReport)
    async expiringCustomersOnDate(
        @Arg("targetDate") targetDate: string
    ): Promise<ExpiringCustomerReport> {
        try {
            // Find customers whose `end_membership_date` matches the target date
            const customers = await Customer.find({
                where: {
                    end_membership_date: targetDate,
                },
            });

            // Count total customers expiring on the provided date
            const total = customers.length;

            return {
                total,
                customers,
            };
        } catch (error) {
            console.error("Error fetching customers expiring on the target date:", error);
            throw new Error("Failed to fetch customers expiring on the provided date");
        }
    }
}
