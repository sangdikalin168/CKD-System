import {
    Arg,
    Field,
    InterfaceType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { checkAuth } from "../MiddleWare/checkAuth";
import { CouponCard } from "../Entities/CouponCard";

@Resolver()
export class CouponCardResolver {

    @UseMiddleware(checkAuth)
    @Query((_return) => [CouponCard])
    async GetCouponCard(@Arg("coupon_code") coupon_code: string): Promise<CouponCard[]> {
        return await CouponCard.find({ where: { coupon_code: coupon_code, status: "Pending" } });
    }
}