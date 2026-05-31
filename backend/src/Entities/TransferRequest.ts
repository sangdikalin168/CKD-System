import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class TransferRequest extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    request_id: number;

    @Field()
    @Column()
    request_by: number;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    request_date: string;

    @Field()
    @Column()
    reason: string;

    @Field()
    @Column()
    sender_id: number;

    @Field()
    @Column()
    receiver_id: number;

    @Field()
    @Column({ default: 0 })
    checked_by: number;

    @Field()
    @Column()
    checker_comment: string;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    checked_date: string;

    @Field()
    @Column({ default: "Pending" })
    checker_status: string;

    @Field()
    @Column({ default: 0 })
    approved_by: number;

    @Field()
    @Column()
    approver_comment: string;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    approved_date: string;

    @Field()
    @Column({ default: "Pending" })
    approver_status: string;

    @Field()
    @Column({ default: "Pending" })
    process: string;

    @Field()
    @Column({ default: 0 })
    processed_by: number;
}
