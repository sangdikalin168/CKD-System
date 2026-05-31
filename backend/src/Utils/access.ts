import { Entitlement } from "../Entities/Entitlement";
import { Package } from "../Entities/Package";
import { PackageFacility } from "../Entities/PackageFacility";
import { Facility } from "../Entities/Facility";
import { AccessModel, EntitlementStatus, ProductType, Shift } from "../Entities/enums";

/**
 * Compatibility glue for the unified model.
 *
 * The legacy mutations (CreateCustomerPayment, CreateFruitPayment, holds,
 * transfers) send price / months / dates but NO package_id. These helpers
 * resolve — or seed — the catalog Package and upsert the Entitlement so the new
 * Purchase / Entitlement tables become the source of truth without changing the
 * GraphQL contract the frontend depends on.
 */

/** Find a TIME package matching (type, price, months), or create one on the fly.
 *  A unique index on (product_type, price, duration_months) backstops races. */
export async function findOrCreateTimePackage(opts: {
    name: string;
    product_type: ProductType;
    price: number;
    duration_months: number;
    grants_door_access?: boolean;
}): Promise<Package> {
    const existing = await Package.findOne({
        where: {
            product_type: opts.product_type,
            price: opts.price,
            duration_months: opts.duration_months,
        },
    });
    if (existing) return existing;

    try {
        return await Package.create({
            name: opts.name,
            product_type: opts.product_type,
            access_model: AccessModel.TIME,
            price: opts.price,
            duration_months: opts.duration_months,
            grants_door_access: opts.grants_door_access ?? false,
            is_active: true,
        }).save();
    } catch (e) {
        // Lost a race against a concurrent insert — the unique index rejected us;
        // re-read the row the winner created.
        const raced = await Package.findOne({
            where: {
                product_type: opts.product_type,
                price: opts.price,
                duration_months: opts.duration_months,
            },
        });
        if (raced) return raced;
        throw e;
    }
}

/** The customer's current ACTIVE (by status) entitlement for a product type. */
export async function activeTimeEntitlement(
    customer_id: number,
    product_type: ProductType
): Promise<Entitlement | null> {
    return await Entitlement.findOne({
        where: { customer_id, product_type, status: EntitlementStatus.ACTIVE },
        order: { entitlement_id: "DESC" },
    });
}

/** The customer's most recent entitlement for a product type, REGARDLESS of
 *  status. This is the "membership line" — renewing an expired one revives this
 *  row rather than spawning a duplicate. */
export async function mostRecentTimeEntitlement(
    customer_id: number,
    product_type: ProductType
): Promise<Entitlement | null> {
    return await Entitlement.findOne({
        where: { customer_id, product_type },
        order: { entitlement_id: "DESC" },
    });
}

/**
 * Extend (or revive, or create) the customer's single long-lived time-based
 * entitlement for a product type. One row per (customer, product_type):
 * a renewal — even of an EXPIRED membership — updates that row instead of
 * creating a second. Returns the saved entitlement.
 */
export async function upsertTimeEntitlement(opts: {
    customer_id: number;
    package_id: number;
    product_type: ProductType;
    valid_from: string;
    valid_until: string;
    shift?: Shift;
    origin_purchase_id?: number;
}): Promise<Entitlement> {
    const ent = await mostRecentTimeEntitlement(opts.customer_id, opts.product_type);

    if (ent) {
        // Revive/extend the existing membership line (keep its original valid_from).
        ent.valid_until = opts.valid_until;
        ent.package_id = opts.package_id;
        ent.status = EntitlementStatus.ACTIVE;
        if (opts.shift) ent.shift = opts.shift;
        return await ent.save();
    }

    return await Entitlement.create({
        customer_id: opts.customer_id,
        package_id: opts.package_id,
        product_type: opts.product_type,
        access_model: AccessModel.TIME,
        shift: opts.shift ?? Shift.Full,
        valid_from: opts.valid_from,
        valid_until: opts.valid_until,
        entries_used: 0,
        status: EntitlementStatus.ACTIVE,
        origin_purchase_id: opts.origin_purchase_id,
    }).save();
}

/**
 * Extend the customer's membership entitlement to a new end date (used by Hold
 * and Transfer, which adjust dates but carry no package). Resolves the package
 * from the existing entitlement, falling back to a seeded membership package if
 * the customer has none yet.
 */
export async function extendMembershipEntitlement(
    customer_id: number,
    valid_until: string,
    valid_from?: string
): Promise<Entitlement> {
    const existing = await mostRecentTimeEntitlement(customer_id, ProductType.MEMBERSHIP);
    const package_id =
        existing?.package_id ??
        (await findOrCreateTimePackage({
            name: "Membership",
            product_type: ProductType.MEMBERSHIP,
            price: 0,
            duration_months: 0,
            grants_door_access: true,
        })).package_id;

    return await upsertTimeEntitlement({
        customer_id,
        package_id,
        product_type: ProductType.MEMBERSHIP,
        valid_from: valid_from ?? existing?.valid_from ?? valid_until,
        valid_until,
    });
}

/**
 * Find (or create) a single-entry TICKET package for a given price that opens a
 * specific facility/place. Creates the package + its package_facility link if it
 * doesn't exist yet. This is how "a ticket for place X" is modeled.
 */
export async function findOrCreateTicketPackage(
    price: number,
    facility_id: number
): Promise<Package> {
    const existing = await Package.createQueryBuilder("p")
        .innerJoin(PackageFacility, "pf", "pf.package_id = p.package_id")
        .where("p.product_type = :pt", { pt: ProductType.TICKET })
        .andWhere("p.price = :price", { price })
        .andWhere("pf.facility_id = :fid", { fid: facility_id })
        .getOne();
    if (existing) return existing;

    const facility = await Facility.findOne({ where: { facility_id } });
    const pkg = await Package.create({
        name: `Ticket - ${facility?.code ?? facility_id}`,
        product_type: ProductType.TICKET,
        access_model: AccessModel.COUNT,
        price,
        entry_count: 1,
        grants_door_access: true,
        is_active: true,
    }).save();
    await PackageFacility.create({
        package_id: pkg.package_id,
        facility_id,
    }).save();
    return pkg;
}

/** Create a single-use COUNT entitlement (ticket). Anonymous unless customer given. */
export async function createTicketEntitlement(opts: {
    package_id: number;
    access_code: string;
    customer_id?: number;
    origin_purchase_id?: number;
}): Promise<Entitlement> {
    return await Entitlement.create({
        customer_id: opts.customer_id,
        package_id: opts.package_id,
        product_type: ProductType.TICKET,
        access_model: AccessModel.COUNT,
        shift: Shift.Full,
        entries_total: 1,
        entries_used: 0,
        access_code: opts.access_code,
        status: EntitlementStatus.ACTIVE,
        origin_purchase_id: opts.origin_purchase_id,
    }).save();
}
