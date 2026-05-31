import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, Float, ObjectType } from "type-graphql";
import { Facility } from "./Facility";

@Entity()
@ObjectType()
export class TicketPriceConfig extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    config_id!: number;

    @Field(() => Float)
    @Column({ type: "float", unique: true })
    price!: number;

    @Field({ nullable: true })
    @Column({ length: 100, nullable: true })
    label?: string;

    /** Display-only age group tag shown on the cashier ticket card. e.g. "កុមារ", "មនុស្សពេញវ័យ" */
    @Field({ nullable: true })
    @Column({ length: 50, nullable: true })
    age_group?: string;

    /** Photo of the key/locker to hand the customer — shown to check-in staff on
     *  scan. Stored as a base64 data URL so the DB-direct check-in app can render
     *  it inline (no backend HTTP dependency). */
    @Field({ nullable: true })
    @Column({ type: "longtext", nullable: true })
    key_image?: string;

    @Field(() => [Facility])
    @ManyToMany(() => Facility, { eager: true })
    @JoinTable({ name: "ticket_price_config_facility" })
    facilities!: Facility[];
}
