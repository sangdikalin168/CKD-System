import { Between, MoreThan, DataSource } from "typeorm";
import { Customer } from "../Entities/Customer";
import { Arg, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
import { MemberScan } from "../Entities/MemberScan";
import { MemberPayment } from "../Entities/MemberPayment";

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

@ObjectType()
class CustomerMembershipDetail {
    @Field()
    customer_id!: number;

    @Field()
    customer_code!: string;

    @Field()
    customer_name!: string;

    @Field()
    phone!: string;

    @Field()
    gender!: string;

    @Field()
    end_membership_date!: string;

    @Field()
    month_qty!: number;

    @Field()
    promotion!: string;

    @Field()
    price!: number;

    @Field()
    payment_date!: Date;
}

@ObjectType()
class MembershipDurationGroup {
    @Field(() => Int)
    month_duration!: number;

    @Field(() => Int)
    total_customers!: number;

    @Field(() => Number)
    total_revenue!: number;

    @Field(() => [CustomerMembershipDetail])
    customers!: CustomerMembershipDetail[];
}

@ObjectType()
class CustomersByMembershipDurationReport {
    @Field(() => [MembershipDurationGroup])
    groups!: MembershipDurationGroup[];

    @Field(() => Int)
    total_all_customers!: number;

    @Field(() => Number)
    total_all_revenue!: number;
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

    // Query for customers grouped by their LATEST membership duration (1, 3, 6, 12 months)
    // This shows what type each active customer currently has based on their most recent purchase
    @Query(() => CustomersByMembershipDurationReport)
    async customersByMembershipDuration(
        @Arg("fromDate") fromDate: string,
        @Arg("toDate") toDate: string
    ): Promise<CustomersByMembershipDurationReport> {
        try {
            // Get current date for active customer check
            const currentDate = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD' format
            
            // Define the membership durations we want to track
            const durations = [1, 3, 6, 12];
            const groups: MembershipDurationGroup[] = [];
            
            let totalAllCustomers = 0;
            let totalAllRevenue = 0;

            for (const duration of durations) {
                // Subquery to get the latest payment_id for each customer
                const latestPaymentSubquery = MemberPayment
                    .createQueryBuilder("mp_sub")
                    .select("MAX(mp_sub.payment_id)", "max_payment_id")
                    .where("mp_sub.customer_id = member_payment.customer_id")
                    .getQuery();

                // Main query: Get customers whose LATEST payment has this month_qty
                const results = await MemberPayment
                    .createQueryBuilder("member_payment")
                    .innerJoin(
                        Customer, 
                        "customer", 
                        "customer.customer_id = member_payment.customer_id"
                    )
                    .where(`member_payment.payment_id = (${latestPaymentSubquery})`)
                    .andWhere("member_payment.month_qty = :duration", { duration })
                    .andWhere("customer.end_membership_date > :currentDate", { currentDate })
                    .select([
                        "customer.customer_id as customer_id",
                        "customer.customer_code as customer_code",
                        "customer.customer_name as customer_name",
                        "customer.phone as phone",
                        "customer.gender as gender",
                        "customer.end_membership_date as end_membership_date",
                        "member_payment.month_qty as month_qty",
                        "member_payment.promotion as promotion",
                        "member_payment.price as price",
                        "member_payment.payment_date as payment_date"
                    ])
                    .getRawMany();

                // Calculate totals for this duration group
                const totalCustomers = results.length;
                const totalRevenue = results.reduce((sum, r) => sum + parseFloat(r.price || 0), 0);

                totalAllCustomers += totalCustomers;
                totalAllRevenue += totalRevenue;

                // Map the results to CustomerMembershipDetail
                const customers: CustomerMembershipDetail[] = results.map(row => ({
                    customer_id: row.customer_id,
                    customer_code: row.customer_code,
                    customer_name: row.customer_name,
                    phone: row.phone,
                    gender: row.gender,
                    end_membership_date: row.end_membership_date,
                    month_qty: row.month_qty,
                    promotion: row.promotion,
                    price: parseFloat(row.price),
                    payment_date: row.payment_date
                }));

                groups.push({
                    month_duration: duration,
                    total_customers: totalCustomers,
                    total_revenue: totalRevenue,
                    customers: customers
                });
            }

            return {
                groups,
                total_all_customers: totalAllCustomers,
                total_all_revenue: totalAllRevenue
            };
        } catch (error) {
            console.error("Error fetching customers by membership duration:", error);
            throw new Error("Failed to fetch customers by membership duration");
        }
    }
}
