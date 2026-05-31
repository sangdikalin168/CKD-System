import { TrainningPrice } from "../Entities/TrainningPrice";
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
export class TranningPriceResolver {
    @UseMiddleware(checkAuth)
    @Query((_return) => [TrainningPrice])
    async GetTranningPrice(): Promise<TrainningPrice[]> {
        return await TrainningPrice.find({ order: { id: "ASC" } });
    }
}