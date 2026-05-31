import { BaseEntity, Check, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { AccessModel, EntitlementStatus, ProductType, Shift } from "./enums";
import { Customer } from "./Customer";
import { Package } from "./Package";

/**
 * The right to enter — the heart of the model. One row = one grant of access.
 *
 *   TIME products  -> use valid_from / valid_until.
 *   COUNT products -> use entries_total / entries_used.
 *
 * Answers "what can this person do right now?" in one place (previously scattered
 * across Customer columns + 5 payment tables).
 */
@Entity()
@ObjectType()
// COUNT products can never be over-consumed (NULL entries_total => TIME product, check passes).
@Check("entries_used <= entries_total")
export class Entitlement extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    entitlement_id!: number;

    /** Nullable: anonymous ticket. */
    @Field({ nullable: true })
    @Index()
    @Column({ nullable: true })
    customer_id?: number;

    @Field()
    @Index()
    @Column()
    package_id!: number;

    /** Snapshot of the package's type at purchase time. */
    @Field(() => ProductType)
    @Column({ type: "enum", enum: ProductType })
    product_type!: ProductType;

    @Field(() => AccessModel)
    @Column({ type: "enum", enum: AccessModel })
    access_model!: AccessModel;

    /** Access time-window (Full = all day, Morning = mornings only). Used by
     *  the door/check-in to enforce "check in by time" for memberships. */
    @Field(() => Shift)
    @Column({ type: "enum", enum: Shift, default: Shift.Full })
    shift!: Shift;

    // --- TIME products ---
    @Field({ nullable: true })
    @Column({ type: "date", nullable: true })
    valid_from?: string;

    @Field({ nullable: true })
    @Index()
    @Column({ type: "date", nullable: true })
    valid_until?: string;

    // --- COUNT products ---
    @Field({ nullable: true })
    @Column({ type: "int", nullable: true })
    entries_total?: number;

    @Field()
    @Column({ type: "int", default: 0 })
    entries_used!: number;

    /** Ticket / coupon code, scanned at the door. Unique when present. */
    @Field({ nullable: true })
    @Index({ unique: true })
    @Column({ length: 64, nullable: true })
    access_code?: string;

    @Field(() => EntitlementStatus)
    @Index()
    @Column({ type: "enum", enum: EntitlementStatus, default: EntitlementStatus.ACTIVE })
    status!: EntitlementStatus;

    /** First purchase that created this entitlement. Plain column to avoid a
     *  circular FK with Purchase.entitlement_id. */
    @Field({ nullable: true })
    @Column({ nullable: true })
    origin_purchase_id?: number;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at!: string;

    // DB-only FK relations (no @Field).
    @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "customer_id" })
    customer?: Customer;

    @ManyToOne(() => Package, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "package_id" })
    package!: Package;
}
