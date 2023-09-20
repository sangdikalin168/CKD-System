import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class CouponPayment extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    payment_id!: number;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    payment_date!: string;

    @Field()
    @Column()
    user_id: number;

    @Field()
    @Column()
    customer_id: number;

    @Field()
    @Column({ length: 50 })
    card_name: string;

    @Field()
    @Column()
    quantity: number

    @Field()
    @Column({ type: "double" })
    price: number

    @Field()
    @Column({ length: 255 })
    coupon_code: string;

}
