import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class TicketLog extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id: number;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    date_time: string;
}
