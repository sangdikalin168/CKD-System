import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class TrainningPayment extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    payment_id!: number;

    @Field()
    @Column({ type: "date", default: () => "CURRENT_DATE" })
    payment_date!: string;

    @Field()
    @Column()
    user_id: number;

    @Field()
    @Column()
    customer_id: number;

    @Field()
    @Column({ length: 50 })
    type: string;

    @Field()
    @Column({ length: 50 })
    promotion: string;

    @Field()
    @Column({ type: "double" })
    price: number
}
