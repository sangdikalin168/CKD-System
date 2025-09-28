import { Between, MoreThan, DataSource } from "typeorm";
import { Customer } from "../Entities/Customer";
import { Arg, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import { MemberScan } from "../Entities/MemberScan";

//Define the ScanLog type
@ObjectType()
class ScanLog {
    @Field()
    scanDate!: string;
}

@ObjectType()
class CustomerScanReport {
    @Field()
    member_id!: number;

    @Field()
    FromDate!: string;

    @Field()
    ToDate!: string;

    @Field(() => [ScanLog])
    ScanLog!: ScanLog[];
}


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
        @Arg("fromDate") fromDate: string,
        @Arg("toDate") toDate: string
    ): Promise<ExpiringCustomerReport> {
        try {
            // Find customers whose `end_membership_date` is between the target dates
            const customers = await Customer.find({
                where: {
                    end_membership_date: Between(fromDate, toDate),
                },
                order: { end_membership_date: "ASC" },
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

    // Query for customers from member_scan
    @Query(() => CustomerScanReport)
    async customerScanReport(
        @Arg("memberId") memberId: number,
        @Arg("fromDate") fromDate: string,
        @Arg("toDate") toDate: string
    ): Promise<CustomerScanReport> {
        try {
            // Fetch all member scans between two dates "Customer Scan Log" for member_id
            const scans = await MemberScan.find({
                where: {
                    member_id: memberId,
                    date_time: Between(fromDate, toDate)
                },
            });

            return {
                member_id: memberId,
                FromDate: fromDate,
                ToDate: toDate,
                ScanLog: scans.map(scan => {
                    let scanDate: string;
                    if (typeof scan.date_time === 'number') {
                        scanDate = new Date(scan.date_time).toISOString();
                    } else if (typeof scan.date_time === 'string') {
                        // If it's a numeric string, treat as timestamp
                        const asNum = Number(scan.date_time);
                        scanDate = !isNaN(asNum) ? new Date(asNum).toISOString() : scan.date_time;
                    } else if (Object.prototype.toString.call(scan.date_time) === '[object Date]') {
                        scanDate = (scan.date_time as Date).toISOString();
                    } else {
                        scanDate = String(scan.date_time);
                    }
                    return {
                        member_id: scan.member_id,
                        scanDate
                    };
                })
            };
        } catch (error) {
            console.error("Error fetching customer scan report:", error);
            throw new Error("Failed to fetch customer scan report");
        }
    }
}
