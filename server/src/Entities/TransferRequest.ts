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
    @Column()
    checked_by: string;

    @Field()
    @Column()
    checker_comment: string;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    checker_approved_date: string;

    @Field()
    @Column()
    approved_by: string;

    @Field()
    @Column()
    approver_comment: string;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    approved_date: string;
}
