import { registerEnumType } from "type-graphql";

/**
 * Shared enums + helpers for the unified Product / Purchase / Entitlement model.
 * See docs/db-redesign.md for the full design rationale.
 */

/** What kind of product was sold. Drives behavior across the system. */
export enum ProductType {
    MEMBERSHIP = "MEMBERSHIP",
    TICKET = "TICKET",
    COUPON = "COUPON",
    TRAINING = "TRAINING",
    FRUIT = "FRUIT",
}

/** How an entitlement is consumed: by time window or by a number of entries. */
export enum AccessModel {
    TIME = "TIME",
    COUNT = "COUNT",
}

/** Access time-window for a membership ("check in by time"). */
export enum Shift {
    Full = "Full",
    Morning = "Morning",
}

/** Lifecycle of a single entitlement (the right to enter). */
export enum EntitlementStatus {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    USED_UP = "USED_UP",
    ON_HOLD = "ON_HOLD",
    TRANSFERRED = "TRANSFERRED",
    CANCELLED = "CANCELLED",
}

/** How a check-in was authorized at the door / counter. */
export enum AccessMethod {
    RFID = "RFID",
    FINGERPRINT = "FINGERPRINT",
    MANUAL = "MANUAL",
    CODE = "CODE",
}

export enum CustomerStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

/** Shared by the checker and approver stages of Hold / Transfer requests. */
export enum ApprovalStatus {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
}

/** Whether a request has been physically applied to the entitlement. */
export enum ProcessStatus {
    Pending = "Pending",
    Done = "Done",
}

export enum PaymentMethod {
    CASH = "CASH",
    CARD = "CARD",
    TRANSFER = "TRANSFER",
    OTHER = "OTHER",
}

registerEnumType(ProductType, { name: "ProductType" });
registerEnumType(AccessModel, { name: "AccessModel" });
registerEnumType(Shift, { name: "Shift" });
registerEnumType(EntitlementStatus, { name: "EntitlementStatus" });
registerEnumType(AccessMethod, { name: "AccessMethod" });
registerEnumType(CustomerStatus, { name: "CustomerStatus" });
registerEnumType(ApprovalStatus, { name: "ApprovalStatus" });
registerEnumType(ProcessStatus, { name: "ProcessStatus" });
registerEnumType(PaymentMethod, { name: "PaymentMethod" });

/**
 * MySQL DECIMAL columns are returned as strings by the driver. This transformer
 * keeps them as JS numbers so type-graphql @Field() stays a Float (matching the
 * old `double` behavior, without the floating-point rounding risk on money).
 */
export class ColumnNumericTransformer {
    to(data: number | null): number | null {
        return data;
    }
    from(data: string | null): number | null {
        return data === null || data === undefined ? null : parseFloat(data);
    }
}
