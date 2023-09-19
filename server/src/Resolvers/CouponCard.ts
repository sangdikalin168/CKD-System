import {
    Arg,
    Field,
    InterfaceType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { CouponCard } from "../Entities/CouponCard";

@InterfaceType()
export abstract class CouponCardResponse {

    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: CouponCardResponse })
export class CouponCardMutationResponse implements CouponCardResponse {
    code: number;
    success: boolean;
    message?: string;
}

@Resolver()
export class CouponCardResolver {

    @Query((_return) => [CouponCard])
    async GetCouponCard(@Arg("coupon_code") coupon_code: string): Promise<CouponCard[]> {
        return await CouponCard.find({ where: { coupon_code: coupon_code, status: "Pending" } });
    }
}