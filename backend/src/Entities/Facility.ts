import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";

/**
 * A physical area a customer can enter (Swim / Gym / Steam-Sauna).
 * Packages declare which facilities they grant via PackageFacility, and each
 * CheckIn records which facility was entered.
 */
@Entity()
@ObjectType()
export class Facility extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field()
    facility_id!: number;

    /** Stable machine code, e.g. SWIM / GYM / STEAM. */
    @Field()
    @Index({ unique: true })
    @Column({ length: 30 })
    code!: string;

    @Field()
    @Column({ length: 100 })
    name!: string;

    /** Whether entering this facility goes through the RFID door reader. */
    @Field()
    @Column({ default: false })
    requires_door_access!: boolean;
}
