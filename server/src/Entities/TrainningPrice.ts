import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class TrainningPrice extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: number;

    @Field()
    @Column({ length: 50 })
    name!: string;

    @Field()
    @Column({ length: 50 })
    type!: string;

    @Field()
    @Column({ default: 1 })
    month_qty: number;

    @Field()
    @Column({ type: "double" })
    price: number;
}
