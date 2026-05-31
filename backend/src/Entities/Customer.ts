import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { CustomerStatus } from "./enums";

/**
 * A member / person who buys packages and enters the club.
 *
 * COMPATIBILITY NOTE: the legacy state columns (end_membership_date,
 * end_fruit_date, key_status, towel_status, shift, customer_name, created_date)
 * are KEPT so the existing frontend + check-in app keep working. The unified
 * model (Purchase / Entitlement) is dual-written alongside them. Once all reads
 * move to the new model these can be dropped (see docs/db-redesign-migration.md).
 * New columns (rfid_uid, date_of_birth, status) are additive.
 */
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
    @Column({ length: 2000 })
    fingerprint: string;

    @Field()
    @Column({ type: "date", default: () => "CURRENT_DATE" })
    end_membership_date!: string;

    @Field()
    @Column({ type: "date", default: () => "CURRENT_DATE" })
    end_fruit_date!: string;

    @Field()
    @Column({ length: 10, default: "un_take" })
    key_status: string;

    @Field()
    @Column({ length: 10, default: "un_take" })
    towel_status: string;

    @Field()
    @Column({ length: 20, default: "Full" })
    shift: string;

    // ─── New (additive) — door access + lifecycle ──────────────────────────────
    /** RFID card UID used for door access. The "RFID flow" hook (docs §6). */
    @Field({ nullable: true })
    @Column({ length: 64, nullable: true })
    rfid_uid?: string;

    @Field({ nullable: true })
    @Column({ type: "date", nullable: true })
    date_of_birth?: string;

    @Field(() => CustomerStatus)
    @Column({ type: "enum", enum: CustomerStatus, default: CustomerStatus.ACTIVE })
    status!: CustomerStatus;
}
