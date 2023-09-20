import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class TicketPayment extends BaseEntity {
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
    @Column({ type: "double" })
    price: number

    @Field()
    @Column({ length: 255 })
    ticket_code: string;

    @Field()
    @Column({ type: "int", default: 0 })
    is_check: number;

}
