import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Facility } from "./Facility";
import { Package } from "./Package";

/**
 * M:N join — which facilities a package grants access to.
 * A "Swim + Gym" membership package is two rows here.
 */
@Entity()
@ObjectType()
@Index(["package_id", "facility_id"], { unique: true })
export class PackageFacility extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    id!: number;

    @Field()
    @Column()
    package_id!: number;

    @Field()
    @Column()
    facility_id!: number;

    // DB-only FK relations (no @Field) — keep the GraphQL contract scalar while
    // enforcing referential integrity.
    @ManyToOne(() => Package, { onDelete: "CASCADE" })
    @JoinColumn({ name: "package_id" })
    package!: Package;

    @ManyToOne(() => Facility, { onDelete: "CASCADE" })
    @JoinColumn({ name: "facility_id" })
    facility!: Facility;
}
