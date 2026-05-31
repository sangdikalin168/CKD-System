import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Hold extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    hold_id: number;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    hold_date: string;

    @Field()
    @Column()
    request_id: number;

    @Field()
    @Column({ type: "double" })
    fee: number;

}
