import { AgeGroup, MemberPriceTable, ShiftType, CustomerType } from "../Entities/MemberPriceTable";
import {
    Arg,
    Field,
    ID,
    Int,
    InterfaceType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";

@InterfaceType()
export abstract class IMemberPriceTableResponse {
    @Field()
    code: number;

    @Field()
    success: boolean;

    @Field({ nullable: true })
    message?: string;
}

@ObjectType({ implements: IMemberPriceTableResponse })
export class MemberPriceTableMutationResponse implements IMemberPriceTableResponse {
    code: number;
    success: boolean;
    message?: string;
}



@Resolver(() => MemberPriceTable)
export class MemberPriceTableResolver {
    // Get all members
    @Query(() => [MemberPriceTable])
    async getAllMemberPriceTable(): Promise<MemberPriceTable[]> {
        return await MemberPriceTable.find();
    }


    // Get a single by ID
    @Query(() => MemberPriceTable, { nullable: true })
    async getMemberPriceById(@Arg("id") id: number): Promise<MemberPriceTable | null> {
        return await MemberPriceTable.findOneBy({ id });
    }

    // Mutation: Create a new pricing configuration
    @Mutation(() => MemberPriceTable)
    async createMemberPrice(
        @Arg("description") description: string,
        @Arg("ageGroup") ageGroup: AgeGroup,
        @Arg("customerType") customerType: CustomerType,
        @Arg("shift", { defaultValue: ShiftType.Full }) shift: ShiftType,
        @Arg("monthQty", { defaultValue: 1 }) monthQty: number,
        @Arg("price") price: number,
        @Arg("entryQty", { defaultValue: 1 }) entryQty: number
    ): Promise<MemberPriceTable> {
        const newPrice = MemberPriceTable.create({
            description,
            ageGroup,
            customerType,
            shift,
            monthQty,
            price,
            entryQty,
        });
        await newPrice.save();
        return newPrice;
    }

    // Mutation: Update an existing pricing configuration
    @Mutation(() => MemberPriceTable, { nullable: true })
    async updatePrice(
        @Arg("id", () => Int) id: number,
        @Arg("description", { nullable: true }) description?: string,
        @Arg("ageGroup", { nullable: true }) ageGroup?: AgeGroup,
        @Arg("customerType", { nullable: true }) customerType?: CustomerType,
        @Arg("shift", { nullable: true }) shift?: ShiftType,
        @Arg("monthQty", { nullable: true }) monthQty?: number,
        @Arg("price", { nullable: true }) price?: number,
        @Arg("entryQty", { nullable: true }) entryQty?: number
    ): Promise<MemberPriceTable | null> {
        const priceConfig = await MemberPriceTable.findOneBy({ id });
        if (!priceConfig) return null;

        if (description !== undefined) priceConfig.description = description;
        if (ageGroup !== undefined) priceConfig.ageGroup = ageGroup;
        if (customerType !== undefined) priceConfig.customerType = customerType;
        if (shift !== undefined) priceConfig.shift = shift;
        if (monthQty !== undefined) priceConfig.monthQty = monthQty;
        if (price !== undefined) priceConfig.price = price;
        if (entryQty !== undefined) priceConfig.entryQty = entryQty;

        await priceConfig.save();
        return priceConfig;
    }

    // Delete a member price
    @Mutation(() => Boolean)
    async deleteMemberPrice(@Arg("id") id: number): Promise<boolean> {
        const member = await MemberPriceTable.findOneBy({ id });
        if (!member) return false;

        await member.remove();
        return true;
    }
}