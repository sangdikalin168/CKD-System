import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { AccessMethod } from "./enums";
import { Customer } from "./Customer";
import { Entitlement } from "./Entitlement";
import { Facility } from "./Facility";

/**
 * Every entry event, of every product type — replaces MemberScan, TicketLog and
 * CouponLog. Crucially carries entitlement_id, so you finally know WHAT a visit
 * consumed (a membership day vs. a coupon entry vs. a ticket).
 */
@Entity()
@ObjectType()
export class CheckIn extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    check_in_id!: number;

    @Field()
    @Index()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    check_in_time!: string;

    @Field({ nullable: true })
    @Index()
    @Column({ nullable: true })
    customer_id?: number;

    /** Which entitlement this visit consumed / validated against. */
    @Field({ nullable: true })
    @Index()
    @Column({ nullable: true })
    entitlement_id?: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    facility_id?: number;

    @Field(() => AccessMethod)
    @Column({ type: "enum", enum: AccessMethod, default: AccessMethod.MANUAL })
    access_method!: AccessMethod;

    /** users.user_id for manual check-ins (null for automated RFID). */
    @Field({ nullable: true })
    @Column({ nullable: true })
    recorded_by?: number;

    @Field({ nullable: true })
    @Column({ length: 255, nullable: true })
    note?: string;

    // DB-only FK relations (no @Field).
    @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "customer_id" })
    customer?: Customer;

    @ManyToOne(() => Entitlement, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "entitlement_id" })
    entitlement?: Entitlement;

    @ManyToOne(() => Facility, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "facility_id" })
    facility?: Facility;
}
