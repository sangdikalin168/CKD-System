import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class FruitPayment extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    payment_id!: number;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    payment_date!: Date;

    @Field()
    @Column()
    user_id: number;

    @Field()
    @Column()
    customer_id: number;

    @Field()
    @Column({ length: 50 })
    promotion: string;

    @Field()
    @Column({ type: "double" })
    price: number;

    @Field()
    @Column({ type: "date", default: () => "CURRENT_DATE" })
    old_end!: string;

    @Field()
    @Column({ type: "date", default: () => "CURRENT_DATE" })
    new_end!: string;

    @Field()
    @Column({ default: 1 })
    month_qty: number;
}
