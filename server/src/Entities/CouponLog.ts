import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class CouponLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    log_id: number;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    log_datetime: string;
}
