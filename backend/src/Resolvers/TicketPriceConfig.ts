import { Arg, Float, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { In } from "typeorm";
import { checkAuth } from "../MiddleWare/checkAuth";
import { TicketPriceConfig } from "../Entities/TicketPriceConfig";
import { Facility } from "../Entities/Facility";

@Resolver()
export class TicketPriceConfigResolver {

    @UseMiddleware(checkAuth)
    @Query(() => [TicketPriceConfig])
    async GetTicketPriceConfigs(): Promise<TicketPriceConfig[]> {
        return TicketPriceConfig.find({ order: { price: "ASC" } });
    }

    @UseMiddleware(checkAuth)
    @Mutation(() => TicketPriceConfig)
    async UpsertTicketPriceConfig(
        @Arg("price", () => Float) price: number,
        @Arg("facility_ids", () => [Float]) facility_ids: number[],
        @Arg("label", { nullable: true }) label?: string,
        @Arg("key_image", { nullable: true }) key_image?: string,
        @Arg("age_group", { nullable: true }) age_group?: string,
    ): Promise<TicketPriceConfig> {
        const facilities = await Facility.findBy({ facility_id: In(facility_ids) });

        let config = await TicketPriceConfig.findOne({ where: { price } });
        if (!config) config = TicketPriceConfig.create({ price });

        config.facilities = facilities;
        if (label !== undefined) config.label = label;
        if (key_image !== undefined) config.key_image = key_image;
        if (age_group !== undefined) config.age_group = age_group;
        return config.save();
    }

    @UseMiddleware(checkAuth)
    @Mutation(() => Boolean)
    async DeleteTicketPriceConfig(
        @Arg("config_id") config_id: number,
    ): Promise<boolean> {
        const result = await TicketPriceConfig.delete({ config_id });
        return (result.affected ?? 0) > 0;
    }
}
