import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { Facility } from "./Facility";

export enum ShiftType {
    Full = "Full",
    Morning = "Morning",
}

export enum AgeGroup {
    Kid = "Kid",
    Adult = "Adult",
}

export enum CustomerType {
    Full = "Full",
    Old = "Old",
    New = "New",
}

export enum ServiceType {
    Swim = "Swim",
    SwimGym = "SwimGym",
    SwimSteam = "SwimSteam",
    SwimGymSteam = "SwimGymSteam",
}

registerEnumType(ShiftType,    { name: "ShiftType",    description: "Full or Morning shift." });
registerEnumType(AgeGroup,     { name: "AgeGroup",     description: "Kid or Adult." });
registerEnumType(CustomerType, { name: "CustomerType", description: "Full, Old, or New member." });
registerEnumType(ServiceType,  { name: "ServiceType",  description: "Derived from selected facilities." });

@Entity()
@ObjectType()
export class MemberPriceTable extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: number;

    @Field()
    @Column({ length: 100 })
    description!: string;

    @Field(() => AgeGroup)
    @Column({ type: "enum", enum: AgeGroup })
    ageGroup!: AgeGroup;

    @Field(() => CustomerType)
    @Column({ type: "enum", enum: CustomerType })
    customerType!: CustomerType;

    /** Derived from selected facilities — used for tab grouping. */
    @Field(() => ServiceType)
    @Column({ type: "enum", enum: ServiceType, default: ServiceType.Swim })
    serviceType!: ServiceType;

    @Field(() => ShiftType)
    @Column({ type: "enum", enum: ShiftType, default: ShiftType.Full })
    shift!: ShiftType;

    @Field()
    @Column({ type: "float", default: 1 })
    monthQty!: number;

    @Field()
    @Column({ type: "double" })
    price!: number;

    @Field()
    @Column({ type: "int", default: 1 })
    entryQty!: number;

    @Field({ nullable: true })
    @Column({ type: "longtext", nullable: true })
    key_image?: string;

    /** Facilities this membership grants access to. */
    @Field(() => [Facility])
    @ManyToMany(() => Facility, { eager: true })
    @JoinTable({ name: "member_price_facility" })
    facilities!: Facility[];
}
