import { Query, Resolver, UseMiddleware } from "type-graphql";
import { checkAuth } from "../MiddleWare/checkAuth";
import { Facility } from "../Entities/Facility";

@Resolver()
export class FacilityResolver {
    /** List the access places (Swim / Gym / Steam) — used by the ticket place picker. */
    @Query(() => [Facility])
    async facilities(): Promise<Facility[]> {
        return await Facility.find({ order: { facility_id: "ASC" } });
    }
}
