import { FruitPrice } from "../Entities/FruitPrice";
import {
    Field,
    InterfaceType,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { checkAuth } from "../MiddleWare/checkAuth";

@Resolver()
export class FruitPriceResolver {
    @UseMiddleware(checkAuth)
    @Query((_return) => [FruitPrice])
    async GetFruitPriceTable(): Promise<FruitPrice[]> {
        return await FruitPrice.find({ order: { id: "ASC" } });
    }
}