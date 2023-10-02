import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class MemberPriceTable extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: number;

    @Field()
    @Column({ length: 50 })
    name!: string;

    @Field()
    @Column({ length: 50 })
    age!: string;

    @Field()
    @Column({ length: 50 })
    member_type!: string;

    @Field()
    @Column({ type: "float", default: 1 })
    month_qty: number;

    @Field()
    @Column({ type: "double" })
    price: number;

    @Field()
    @Column({ length: 10, default: "Full" })
    shift: string;
}
