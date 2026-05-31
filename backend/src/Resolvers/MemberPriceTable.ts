import { AgeGroup, MemberPriceTable, ShiftType, CustomerType, ServiceType } from "../Entities/MemberPriceTable";
import { Facility } from "../Entities/Facility";
import {
    Arg,
    Field,
    Int,
    InterfaceType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    UseMiddleware,
} from "type-graphql";
import { In } from "typeorm";
import { checkAuth } from "../MiddleWare/checkAuth";

/** Derive the legacy ServiceType enum from a list of facility codes.
 *  Used for tab grouping in the frontend. */
function deriveServiceType(facilities: Facility[]): ServiceType {
    const codes = new Set(facilities.map((f) => f.code));
    const hasSwim  = codes.has("SWIM");
    const hasGym   = codes.has("GYM");
    const hasSteam = codes.has("STEAM");

    if (hasSwim && hasGym && hasSteam) return ServiceType.SwimGymSteam;
    if (hasSwim && hasGym)   return ServiceType.SwimGym;
    if (hasSwim && hasSteam) return ServiceType.SwimSteam;
    return ServiceType.Swim; // default / swim-only
}

@Resolver(() => MemberPriceTable)
export class MemberPriceTableResolver {

    @UseMiddleware(checkAuth)
    @Query(() => [MemberPriceTable])
    async getAllMemberPriceTable(): Promise<MemberPriceTable[]> {
        return await MemberPriceTable.find();
    }

    @UseMiddleware(checkAuth)
    @Query(() => MemberPriceTable, { nullable: true })
    async getMemberPriceById(@Arg("id") id: number): Promise<MemberPriceTable | null> {
        return await MemberPriceTable.findOneBy({ id });
    }

    @UseMiddleware(checkAuth)
    @Mutation(() => MemberPriceTable)
    async createMemberPrice(
        @Arg("description") description: string,
        @Arg("ageGroup") ageGroup: AgeGroup,
        @Arg("customerType") customerType: CustomerType,
        @Arg("shift", { defaultValue: ShiftType.Full }) shift: ShiftType,
        @Arg("monthQty", { defaultValue: 1 }) monthQty: number,
        @Arg("price") price: number,
        @Arg("entryQty", { defaultValue: 1 }) entryQty: number,
        @Arg("facility_ids", () => [Int], { defaultValue: [] }) facility_ids: number[],
        @Arg("key_image", { nullable: true }) key_image?: string,
    ): Promise<MemberPriceTable> {
        const facilities = facility_ids.length
            ? await Facility.findBy({ facility_id: In(facility_ids) })
            : [];
        const serviceType = deriveServiceType(facilities);

        const entry = MemberPriceTable.create({
            description, ageGroup, customerType, serviceType,
            shift, monthQty, price, entryQty, key_image,
        });
        entry.facilities = facilities;
        await entry.save();
        return entry;
    }

    @UseMiddleware(checkAuth)
    @Mutation(() => MemberPriceTable, { nullable: true })
    async updatePrice(
        @Arg("id", () => Int) id: number,
        @Arg("description", { nullable: true }) description?: string,
        @Arg("ageGroup", { nullable: true }) ageGroup?: AgeGroup,
        @Arg("customerType", { nullable: true }) customerType?: CustomerType,
        @Arg("shift", { nullable: true }) shift?: ShiftType,
        @Arg("monthQty", { nullable: true }) monthQty?: number,
        @Arg("price", { nullable: true }) price?: number,
        @Arg("entryQty", { nullable: true }) entryQty?: number,
        @Arg("facility_ids", () => [Int], { nullable: true }) facility_ids?: number[],
        @Arg("key_image", { nullable: true }) key_image?: string,
    ): Promise<MemberPriceTable | null> {
        const entry = await MemberPriceTable.findOneBy({ id });
        if (!entry) return null;

        if (description  !== undefined) entry.description  = description;
        if (ageGroup     !== undefined) entry.ageGroup     = ageGroup;
        if (customerType !== undefined) entry.customerType = customerType;
        if (shift        !== undefined) entry.shift        = shift;
        if (monthQty     !== undefined) entry.monthQty     = monthQty;
        if (price        !== undefined) entry.price        = price;
        if (entryQty     !== undefined) entry.entryQty     = entryQty;
        if (key_image    !== undefined) entry.key_image    = key_image;

        if (facility_ids !== undefined) {
            const facilities = facility_ids.length
                ? await Facility.findBy({ facility_id: In(facility_ids) })
                : [];
            entry.facilities = facilities;
            entry.serviceType = deriveServiceType(facilities);
        }

        await entry.save();
        return entry;
    }

    @UseMiddleware(checkAuth)
    @Mutation(() => Boolean)
    async deleteMemberPrice(@Arg("id") id: number): Promise<boolean> {
        const entry = await MemberPriceTable.findOneBy({ id });
        if (!entry) return false;
        await entry.remove();
        return true;
    }
}
