import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class HoldRequest extends BaseEntity {
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
    customer_id: number;

    @Field()
    @Column()
    reason: string;

    @Field()
    @Column({ type: "date" })
    from_date: string;

    @Field()
    @Column({ type: "date" })
    to_date: string;

    @Field()
    @Column({ type: "date" })
    old_end: string;

    @Field()
    @Column({ type: "date" })
    new_end: string;

    @Field()
    @Column({ default: 0 })
    checked_by: number;

    @Field()
    @Column()
    checker_comment: string;

    @Field()
    @Column({ type: "datetime", default: "2000-01-01" })
    checker_approved_date: string;

    @Field()
    @Column({ default: 0 })
    approved_by: number;

    @Field()
    @Column()
    approver_comment: string;

    @Field()
    @Column({ type: "datetime", default: "2000-01-01" })
    approved_date: string;
}
