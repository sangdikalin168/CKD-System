import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
export class Customer extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    customer_id!: number;

    @Field()
    @Column({ type: "date", default: () => "CURRENT_DATE" })
    created_date!: string;

    @Field()
    @Column()
    created_by: number;

    @Field()
    @Column({ length: 50 })
    customer_code!: string;

    @Field()
    @Column({ length: 50 })
    customer_name!: string;

    @Field()
    @Column({ length: 50 })
    phone!: string;

    @Field()
    @Column({ length: 50 })
    gender: string;

    @Field()
    @Column({ length: 50 })
    image_path: string;

    @Field()
    @Column({ length: 255 })
    fingerprint: string;

    @Field()
    @Column({ type: "date", default: () => "CURRENT_DATE" })
    end_membership_date!: string;

    @Field()
    @Column({ length: 10, default: "un_take" })
    key_status: string;

    @Field()
    @Column({ length: 10, default: "un_take" })
    towel_status: string;

    @Field()
    @Column({ length: 20, default: "Full" })
    shift: string
}
