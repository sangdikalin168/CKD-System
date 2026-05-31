# CKD Redesign — Migration State & Cutover Guide

Companion to [db-redesign.md](db-redesign.md). Reflects what is **actually implemented**.

---

## 1. What was built (current state)

The redesign is being rolled out as a **strangler-fig / dual-write** migration, not a
big-bang cutover — chosen so the existing frontend and check-in app keep working unchanged.

**New tables (additive, the unified model):**
`facility`, `package`, `package_facility`, `purchase`, `entitlement`, `check_in`.

**Existing tables — backward-compatible:**
- `customer` keeps every legacy column (`customer_name`, `end_membership_date`,
  `end_fruit_date`, `key_status`, `towel_status`, `shift`, …) and only **adds** `rfid_uid`,
  `date_of_birth`, `status`. No drops, no renames.
- `hold`, `hold_request`, `transfer`, `transfer_request` are **unchanged**.

**Resolvers now dual-write** (`backend/src/Resolvers/`):
| Resolver | Legacy write (kept) | New write (added) |
|---|---|---|
| `MemberPayment.CreateCustomerPayment` | `member_payment` + `customer.end_membership_date/shift` | `Purchase` + membership `Entitlement` |
| `FruitPayment.CreateFruitPayment` | `fruit_payment` + `customer.end_fruit_date` | `Purchase` + `FRUIT` `Entitlement` |
| `Hold.CreateHold` | `hold` + `customer.end_membership_date` | extends membership `Entitlement.valid_until` |
| `Transfer.CreateTransfer` | `transfer` + both customers' `end_membership_date` | moves time on both `Entitlement`s |

The dual-write is wrapped in `try/catch` and uses `Utils/access.ts` helpers
(`findOrCreateTimePackage`, `upsertTimeEntitlement`, `activeTimeEntitlement`). The legacy
path remains the invoice/source-of-record during the transition; the new tables accumulate
in parallel. **`tsc` passes with 0 errors and the GraphQL contract is unchanged.**

---

## 2. Deploying this (much safer than the original plan)

Because the schema change is now **additive**, `synchronize: true` is far less dangerous —
it would add the new columns + create the 6 new tables. Still:

```
1. BACK UP                 mysqldump <db> > backup_pre_redesign.sql
2. Sanity-check FKs/Check   new-table FKs require existing customer/users rows to be valid;
                            the entitlement CHECK (entries_used <= entries_total) needs MySQL 8.0.16+
3. Deploy backend           new entities create the new tables; dual-write begins on next sale
4. Backfill history         run scripts/migrate-redesign.sql to populate Purchase/Entitlement
                            from PAST payments (the dual-write only covers NEW activity)
5. Verify                   reconciliation queries (§6 of the SQL)
```

> If you prefer not to auto-alter the live DB, set `synchronize:false` and apply the new
> tables via a reviewed `typeorm migration:generate` instead.

---

## 3. Backfill (past data)

Dual-write only captures activity from go-live forward. To bring *history* into the new
tables, run [scripts/migrate-redesign.sql](../scripts/migrate-redesign.sql) (fill the `[TODO]`
package-matching blanks first). It seeds facilities + packages and back-populates
`purchase` / `entitlement` / `check_in` from the legacy tables.

---

## 4. Later phases (when you're ready)

1. **Migrate READS** — point reports/profile/check-in at `entitlement` + `customer_access_summary`
   (design §5) instead of `customer.end_membership_date`.
2. **Stop dual-writing** the legacy columns once nothing reads them.
3. **Drop legacy columns/tables** — `customer.end_membership_date` etc., and the old
   `*_payment` tables. THIS is the only destructive step, and it comes last, after
   verification. (The slim `customer` in design doc §3.2 is this end-state.)
4. **Check-in app** (`CKD-Check-In`, Python) → read `entitlement` (+ `shift` window) and
   write `check_in`, using `customer.rfid_uid` for the door (design §6).

---

## 5. Door / RFID flow (schema ready)

`customer.rfid_uid` + `package.grants_door_access` + `package_facility` +
`entitlement.shift` (Full/Morning time-window) + `check_in.access_method='RFID'`. Reader
logic lives in the Python app — see design doc §6.
