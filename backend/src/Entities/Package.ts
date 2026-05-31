import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { AccessModel, ColumnNumericTransformer, ProductType } from "./enums";

/**
 * The catalog definition of something you can sell. Replaces MemberPriceTable,
 * TrainningPrice, FruitPrice and the template part of CouponCard.
 *
 *   product_type | access_model | duration_months | entry_count
 *   -------------+--------------+-----------------+------------
 *   MEMBERSHIP   | TIME         | 1 / 3 / 6 / 12  | NULL
 *   TRAINING     | TIME         | 1 (monthly)     | NULL
 *   TICKET       | COUNT        | NULL            | 1
 *   COUPON       | COUNT        | NULL            | 10 / 15 / 20
 */
@Entity()
@ObjectType()
// Backstops the find-or-create helper against races (TIME products have a
// non-null duration_months; COUNT products' NULLs are treated as distinct by MySQL).
@Index(["product_type", "price", "duration_months"], { unique: true })
export class Package extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    package_id!: number;

    @Field()
    @Column({ length: 150 })
    name!: string;

    @Field(() => ProductType)
    @Column({ type: "enum", enum: ProductType })
    product_type!: ProductType;

    @Field(() => AccessModel)
    @Column({ type: "enum", enum: AccessModel })
    access_model!: AccessModel;

    @Field()
    @Column({ type: "decimal", precision: 10, scale: 2, transformer: new ColumnNumericTransformer() })
    price!: number;

    /** TIME products only: length of the access window in months. */
    @Field({ nullable: true })
    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true, transformer: new ColumnNumericTransformer() })
    duration_months?: number;

    /** COUNT products only: how many entries the package grants. */
    @Field({ nullable: true })
    @Column({ type: "int", nullable: true })
    entry_count?: number;

    @Field()
    @Column({ default: false })
    grants_door_access!: boolean;

    @Field()
    @Column({ default: true })
    is_active!: boolean;

    @Field()
    @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    created_at!: string;
}
