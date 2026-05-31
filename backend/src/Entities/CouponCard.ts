import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class CouponCard extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: number;

    @Field()
    @Column({ type: "date", default: () => "CURRENT_DATE" })
    created_date!: string;

    @Field()
    @Column({ length: 255 })
    coupon_code: string;

    @Field()
    @Column({ length: 10, default: "Pending" })
    status: string;

    @Field()
    @Column()
    quantity: number

    @Field()
    @Column({ type: "double" })
    price: number

    @Field()
    @Column({ length: 100 })
    card_name: string;
}
