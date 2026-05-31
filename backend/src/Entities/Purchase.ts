import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { ColumnNumericTransformer, PaymentMethod, Shift } from "./enums";
import { Customer } from "./Customer";
import { Package } from "./Package";
import { Users } from "./Users";

/**
 * THE money table. Every sale of every product type lands here — this is the
 * single source of truth for revenue, replacing MemberPayment, TicketPayment,
 * CouponPayment, TrainningPayment and FruitPayment.
 *
 *   Revenue today = SELECT SUM(price_paid) FROM purchase
 *                   WHERE DATE(purchase_date) = CURDATE();
 */
@Entity()
@ObjectType()
export class Purchase extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    purchase_id!: number;

    @Field()
    @Index()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    purchase_date!: string;

    /** Nullable: an anonymous walk-in ticket still records the money. */
    @Field({ nullable: true })
    @Index()
    @Column({ nullable: true })
    customer_id?: number;

    @Field()
    @Index()
    @Column()
    package_id!: number;

    /** The entitlement this payment created or extended (set after creation). */
    @Field({ nullable: true })
    @Index()
    @Column({ nullable: true })
    entitlement_id?: number;

    /** users.user_id of the cashier. */
    @Field()
    @Column()
    sold_by!: number;

    @Field()
    @Column({ type: "decimal", precision: 10, scale: 2, transformer: new ColumnNumericTransformer() })
    price_paid!: number;

    @Field()
    @Column({ type: "decimal", precision: 10, scale: 2, default: 0, transformer: new ColumnNumericTransformer() })
    discount_amount!: number;

    @Field({ nullable: true })
    @Column({ length: 100, nullable: true })
    promotion?: string;

    @Field(() => PaymentMethod, { nullable: true })
    @Column({ type: "enum", enum: PaymentMethod, nullable: true })
    payment_method?: PaymentMethod;

    /** Shift sold (membership/fruit) — audit snapshot of the entitlement's window. */
    @Field(() => Shift, { nullable: true })
    @Column({ type: "enum", enum: Shift, nullable: true })
    shift?: Shift;

    // --- TIME products: the slice of time this payment bought (+ renewal audit) ---
    @Field({ nullable: true })
    @Column({ type: "date", nullable: true })
    applies_from?: string;

    @Field({ nullable: true })
    @Column({ type: "date", nullable: true })
    applies_until?: string;

    /** valid_until before this renewal (mirrors the old old_end column). */
    @Field({ nullable: true })
    @Column({ type: "date", nullable: true })
    previous_valid_until?: string;

    // --- COUNT products: how many entries this payment added ---
    @Field({ nullable: true })
    @Column({ type: "int", nullable: true })
    entries_added?: number;

    @Field({ nullable: true })
    @Column({ length: 255, nullable: true })
    note?: string;

    // DB-only FK relations (no @Field).
    @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "customer_id" })
    customer?: Customer;

    @ManyToOne(() => Package, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "package_id" })
    package!: Package;

    @ManyToOne(() => Users)
    @JoinColumn({ name: "sold_by" })
    soldByUser!: Users;

    // entitlement_id is intentionally a plain indexed column (no FK relation) to
    // avoid a circular FK with Entitlement.origin_purchase_id.
}
