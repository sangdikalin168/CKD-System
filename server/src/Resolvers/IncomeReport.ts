import { MemberPayment } from "../Entities/MemberPayment";
import { Users } from "../Entities/Users";
import { TicketPayment } from "../Entities/TicketPayment";
import { CouponPayment } from "../Entities/CouponPayment";
import { TrainningPayment } from "../Entities/TrainningPayment";
import { Customer } from "../Entities/Customer";
import { MemberScan } from "../Entities/MemberScan";
import { TicketLog } from "../Entities/TicketLog";
import { CouponLog } from "../Entities/CouponLog";
import {
    Arg,
    Field,
    InterfaceType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { __Type } from "graphql";


// export const UserQueries = {
//     users: async function (_: any, __: any) {
//         const User = (await AppDataSource).getRepository(Users);
//         return await User.find();
//     },
//     member_payment: async (_: any, { dateFrom, dateTo, userId }: any) => {

//     },
//     ticket_payment: async (_: any, { dateFrom, dateTo, userId }: any) => {
//         if (userId === 0) {
//             const result = (await AppDataSource)
//                 .createQueryBuilder(TicketPayment, "ticket_payment")
//                 .select(["price", "payment_date"])
//                 .addSelect("COUNT(ticket_payment.price)", "qty")
//                 .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
//                 .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
//                 .groupBy("price")
//                 .getRawMany()
//             return await result;
//         } else {
//             const result = (await AppDataSource)
//                 .createQueryBuilder(TicketPayment, "ticket_payment")
//                 .select(["price", "payment_date"])
//                 .addSelect("COUNT(ticket_payment.price)", "qty")
//                 .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
//                 .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
//                 .andWhere("user_id = :user_id", { user_id: userId })
//                 .groupBy("price")
//                 .getRawMany()
//             return await result;
//         }

//     },
//     coupon_payment: async (_: any, { dateFrom, dateTo, userId }: any) => {

//         }

//     },
//     trainning_payment: async (_: any, { dateFrom, dateTo, userId }: any) => {



//     },
//     get_seller: async (_: any, { dateFrom, dateTo }: any) => {
//         const ticket_seller = (await AppDataSource)
//             .createQueryBuilder(Users, "users")
//             .innerJoinAndSelect(
//                 TicketPayment, "ticket_payment", "ticket_payment.user_id = users.user_id"
//             )
//             .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
//             .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
//             .getMany();

//         const member_seller = (await AppDataSource)
//             .createQueryBuilder(Users, "users")
//             .innerJoinAndSelect(
//                 MemberPayment, "member_payment", "member_payment.user_id = users.user_id"
//             )
//             .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
//             .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
//             .getMany();

//         const coupon_seller = (await AppDataSource)
//             .createQueryBuilder(Users, "users")
//             .innerJoinAndSelect(
//                 CouponPayment, "coupon_payment", "coupon_payment.user_id = users.user_id"
//             )
//             .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
//             .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
//             .getMany();
//         const trainning_seller = (await AppDataSource)
//             .createQueryBuilder(Users, "users")
//             .innerJoinAndSelect(
//                 TrainningPayment, "trainning_payment", "trainning_payment.user_id = users.user_id"
//             )
//             .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
//             .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
//             .getMany();
//         //console.log((await ticket_seller).concat(await member_seller));
//         return (await ticket_seller).concat((await member_seller).concat((await coupon_seller).concat(await trainning_seller)))
//     },
//     get_details: async (_: any, { dateFrom, dateTo, promotion }: any) => {
//         const result = (await AppDataSource)
//             .createQueryBuilder(Customer, "customer")
//             .innerJoinAndSelect(MemberPayment, "member_payment", "member_payment.customer_id = customer.customer_id")
//             .select(["customer.customer_id as customer_id", "customer_name", "payment_date"])
//             .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
//             .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
//             .andWhere("promotion = :promotion", { promotion: promotion })
//             .getRawMany();
//         return await result;
//     },
//     get_member_detail: async (_: any, { customer_id }: any) => {
//         const repo = (await AppDataSource).getRepository(Customer);
//         const data = repo.findOne({ where: { customer_id: customer_id } })
//         return await data;
//     },
//     get_customer_payment: async (_: any, { customer_id }: any) => {
//         const repo = (await AppDataSource).getRepository(MemberPayment);
//         const data = repo.find({ where: { customer_id: customer_id } })
//         return await data;
//     },


// }

@ObjectType()
class TicketType {

    @Field()
    price: number

    @Field()
    qty: number

    @Field()
    payment_date: String
}

@ObjectType()
class MemberType {

    @Field()
    price: number

    @Field()
    qty: number

    @Field()
    promotion: String
}

@ObjectType()
class CouponType {

    @Field()
    price: number

    @Field()
    qty: number

    @Field()
    card_name: String
}

@ObjectType()
class TrainningType {

    @Field()
    price: number

    @Field()
    qty: number

    @Field()
    promotion: String
}


@Resolver()
export class IncomeReportResolver {

    @Query((_return) => [Users])
    async GetSeller(
        @Arg(("dateFrom")) dateFrom: String,
        @Arg(("dateTo")) dateTo: String
    ) {
        const ticket_seller = await Users
            .createQueryBuilder("users")
            .innerJoinAndSelect(
                TicketPayment, "ticket_payment", "ticket_payment.user_id = users.user_id"
            )
            .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
            .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
            .getMany();
        return await ticket_seller
    }

    @Query((_return) => [TicketType])
    async GetTicketPayment(
        @Arg(("dateFrom")) dateFrom: String,
        @Arg(("dateTo")) dateTo: String,
        @Arg(("userId")) userId: number
    ) {

        if (userId === 0) {
            const results = await TicketPayment
                .createQueryBuilder("ticket_payment")
                .select(["price", "payment_date"])
                .addSelect("COUNT(ticket_payment.price)", "qty")
                .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
                .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
                .groupBy("price")
                .getRawMany()
            return results;
        } else {
            const results = await TicketPayment
                .createQueryBuilder("ticket_payment")
                .select(["price", "payment_date"])
                .addSelect("COUNT(ticket_payment.price)", "qty")
                .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
                .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
                .andWhere("user_id = :user_id", { user_id: userId })
                .groupBy("price")
                .getRawMany()
            return results;
        }
    }

    @Query((_return) => [MemberType])
    async GetMemberPayments(
        @Arg(("dateFrom")) dateFrom: String,
        @Arg(("dateTo")) dateTo: String,
        @Arg(("userId")) userId: number
    ) {

        if (userId === 0) {
            const result = await MemberPayment
                .createQueryBuilder("member_payment")
                .select(["promotion", "price"])
                .addSelect("COUNT(member_payment.price)", "qty")
                .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
                .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
                .groupBy("promotion")
                .getRawMany()
            return result;
        }
        else {
            const result = await MemberPayment
                .createQueryBuilder("member_payment")
                .select(["promotion", "price"])
                .addSelect("COUNT(member_payment.price)", "qty")
                .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
                .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
                .andWhere("user_id = :user_id", { user_id: userId })
                .groupBy("promotion")
                .getRawMany()
            return result;
        }
    }

    @Query((_return) => [TrainningType])
    async GetTrainningPayments(
        @Arg(("dateFrom")) dateFrom: String,
        @Arg(("dateTo")) dateTo: String,
        @Arg(("userId")) userId: number
    ) {
        if (userId === 0) {
            const result = await TrainningPayment
                .createQueryBuilder("trainning_payment")
                .select(["price", "promotion"])
                .addSelect("COUNT(trainning_payment.price)", "qty")
                .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
                .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
                .groupBy("promotion")
                .getRawMany()
            return result;
        }
        else {
            const result = await TrainningPayment
                .createQueryBuilder("trainning_payment")
                .select(["price", "promotion"])
                .addSelect("COUNT(trainning_payment.price)", "qty")
                .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
                .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
                .andWhere("user_id = :user_id", { user_id: userId })
                .groupBy("promotion")
                .getRawMany()
            return result;
        }
    }

    @Query((_return) => [CouponType])
    async GetCouponPayments(
        @Arg(("dateFrom")) dateFrom: String,
        @Arg(("dateTo")) dateTo: String,
        @Arg(("userId")) userId: number
    ) {

        if (userId === 0) {
            const result = await CouponPayment
                .createQueryBuilder("coupon_payment")
                .select(["price", "card_name"])
                .addSelect("COUNT(coupon_payment.price)", "qty")
                .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
                .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
                .groupBy("card_name")
                .getRawMany()
            return result;
        } else {
            const result = await CouponPayment
                .createQueryBuilder("coupon_payment")
                .select(["price", "card_name"])
                .addSelect("COUNT(coupon_payment.price)", "qty")
                .andWhere("payment_date >= :dateFrom", { dateFrom: `${dateFrom} 00:00:00` })
                .andWhere("payment_date < :dateTo", { dateTo: `${dateTo} 23:00:00` })
                .andWhere("user_id = :user_id", { user_id: userId })
                .groupBy("card_name")
                .getRawMany()
            return result;
        }
    }
}