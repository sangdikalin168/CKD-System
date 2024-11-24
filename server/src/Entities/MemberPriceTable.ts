import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType, registerEnumType } from "type-graphql";

export enum ShiftType {
    Full = "Full",
    Morning = "Morning",
}

export enum AgeGroup {
    Kid = "Kid",
    Adult = "Adult",
}

export enum CustomerType {
    Old = "Old",
    New = "New",
}

// Register enums with TypeGraphQL
registerEnumType(ShiftType, {
    name: "ShiftType",
    description: "The type of shift (Full or Half).",
});

registerEnumType(AgeGroup, {
    name: "AgeGroup",
    description: "Age classification: Kid or Adult.",
});

registerEnumType(CustomerType, {
    name: "CustomerType",
    description: "Membership type: Old or New.",
});

@Entity()
@ObjectType()
export class MemberPriceTable extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: number;

    @Field()
    @Column({ length: 100 })
    description!: string; // e.g., "Monthly price for Adult Full Shift"

    @Field(() => AgeGroup)
    @Column({ type: "enum", enum: AgeGroup })
    ageGroup!: AgeGroup; // Kid or Adult

    @Field(() => CustomerType)
    @Column({ type: "enum", enum: CustomerType })
    customerType!: CustomerType; // Old or New

    @Field(() => ShiftType)
    @Column({ type: "enum", enum: ShiftType, default: ShiftType.Full })
    shift!: ShiftType; // Full or Half

    @Field()
    @Column({ type: "float", default: 1 })
    monthQty!: number; // Number of months the pricing applies to

    @Field()
    @Column({ type: "double" })
    price!: number; // Price for the specified configuration

    @Field()
    @Column({ type: "int", default: 1 })
    entryQty!: number; // Number of entries allowed for this price
}
