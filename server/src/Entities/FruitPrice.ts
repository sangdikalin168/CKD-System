import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class FruitPrice extends BaseEntity {
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
    @Column({ type: "float", default: 1 })
    month_qty: number;

    @Field()
    @Column({ type: "double" })
    price: number;
}
