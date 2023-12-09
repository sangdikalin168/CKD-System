import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Transfer extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    transfer_id: number;

    @Field()
    @Column()
    transfer_by: number;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    transfer_date: string;

    @Field()
    @Column()
    sender_id: number;

    @Field()
    @Column({ type: "date" })
    sender_old_date: string;

    @Field()
    @Column({ type: "date" })
    sender_new_end: string;

    @Field()
    @Column()
    receiver_id: number;

    @Field()
    @Column({ type: "date" })
    receiver_old_end: string;

    @Field()
    @Column({ type: "date" })
    receiver_new_end: string;

    @Field()
    @Column()
    request_id: number;

    @Field()
    @Column({ type: "double" })
    fee: number;

}
