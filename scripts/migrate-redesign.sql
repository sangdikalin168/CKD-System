-- ============================================================================
--  CKD redesign — seed + data backfill (old model -> unified model)
--  See docs/db-redesign.md (design) and docs/db-redesign-migration.md (cutover).
--
--  ⚠️  RUN ORDER MATTERS. Back up first:  mysqldump <db> > backup_pre_redesign.sql
--  ⚠️  Assumes the NEW tables already exist (created by a reviewed TypeORM
--      migration or the CREATE TABLE block in the migration guide), and the OLD
--      tables (member_payment, coupon_card, ...) are still present.
--  Sections marked [TODO] need a business decision before running.
-- ============================================================================

-- ─── 1. Facilities (concrete, safe to run) ──────────────────────────────────
INSERT INTO facility (code, name, requires_door_access) VALUES
  ('SWIM',  'Swimming',     1),
  ('GYM',   'Gym',          1),
  ('STEAM', 'Steam / Sauna',1)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ─── 2. Packages from the old price tables ──────────────────────────────────
-- 2a. Membership packages from member_price_table.
--     duration_months <- monthQty ; access via package_facility (step 2b).
INSERT INTO package
  (name, product_type, access_model, price, duration_months, entry_count, grants_door_access, is_active, created_at)
SELECT
  mpt.description,
  'MEMBERSHIP', 'TIME',
  mpt.price,
  mpt.monthQty,
  NULL,
  1, 1, NOW()
FROM member_price_table mpt;

-- 2b. Map each membership package's serviceType -> facilities.
--     (Join back by description, which is unique in the price list.)
--     Swim          -> SWIM
--     SwimGym       -> SWIM, GYM
--     SwimSteam     -> SWIM, STEAM
--     SwimGymSteam  -> SWIM, GYM, STEAM
INSERT INTO package_facility (package_id, facility_id)
SELECT p.package_id, f.facility_id
FROM package p
JOIN member_price_table mpt ON mpt.description = p.name
JOIN facility f ON (
      (f.code = 'SWIM')
   OR (f.code = 'GYM'   AND mpt.serviceType IN ('SwimGym','SwimGymSteam'))
   OR (f.code = 'STEAM' AND mpt.serviceType IN ('SwimSteam','SwimGymSteam'))
)
WHERE p.product_type = 'MEMBERSHIP';

-- 2c. Training packages from trainning_price (type = Gym / Swimming).
INSERT INTO package
  (name, product_type, access_model, price, duration_months, entry_count, grants_door_access, is_active, created_at)
SELECT tp.name, 'TRAINING', 'TIME', tp.price, tp.month_qty, NULL, 0, 1, NOW()
FROM trainning_price tp;

-- 2d. Coupon packages from coupon_card (quantity = entry_count).
INSERT INTO package
  (name, product_type, access_model, price, duration_months, entry_count, grants_door_access, is_active, created_at)
SELECT DISTINCT cc.card_name, 'COUPON', 'COUNT', cc.price, NULL, cc.quantity, 0, 1, NOW()
FROM coupon_card cc;

-- 2e. Ticket package(s). Old tickets had a per-payment price and no catalog row.
--     [TODO] set the right base price(s); one default shown.
INSERT INTO package
  (name, product_type, access_model, price, duration_months, entry_count, grants_door_access, is_active, created_at)
VALUES ('Single Entry Ticket', 'TICKET', 'COUNT', 0, NULL, 1, 0, 1, NOW());

-- ─── 3. Purchases (revenue) from the 5 old payment tables ───────────────────
-- The old payment rows do not reference a package, so package_id must be matched.
-- [TODO] Adjust the package match per your data. Membership match below pairs on
--        price + month_qty + a membership package; refine if ambiguous.

-- 3a. Membership payments
INSERT INTO purchase
  (purchase_date, customer_id, package_id, sold_by, price_paid, discount_amount,
   promotion, applies_from, applies_until, previous_valid_until, note)
SELECT
  mp.payment_date, mp.customer_id,
  (SELECT p.package_id FROM package p
     WHERE p.product_type='MEMBERSHIP' AND p.price = mp.price
       AND p.duration_months = mp.month_qty LIMIT 1),     -- [TODO] tighten match
  mp.user_id, mp.price, 0,
  mp.promotion, mp.start_date, mp.new_end, mp.old_end, 'migrated:member_payment'
FROM member_payment mp;

-- 3b. Coupon payments
INSERT INTO purchase
  (purchase_date, customer_id, package_id, sold_by, price_paid, discount_amount, entries_added, note)
SELECT
  cp.payment_date, cp.customer_id,
  (SELECT p.package_id FROM package p
     WHERE p.product_type='COUPON' AND p.price = cp.price AND p.entry_count = cp.quantity LIMIT 1),
  cp.user_id, cp.price, 0, cp.quantity, 'migrated:coupon_payment'
FROM coupon_payment cp;

-- 3c. Training payments  (match by type -> training package name)
INSERT INTO purchase
  (purchase_date, customer_id, package_id, sold_by, price_paid, discount_amount, promotion, note)
SELECT
  tp.payment_date, tp.customer_id,
  (SELECT p.package_id FROM package p WHERE p.product_type='TRAINING' AND p.price = tp.price LIMIT 1), -- [TODO]
  tp.user_id, tp.price, 0, tp.promotion, 'migrated:trainning_payment'
FROM trainning_payment tp;

-- 3d. Ticket payments  (anonymous: customer_id NULL)
INSERT INTO purchase
  (purchase_date, customer_id, package_id, sold_by, price_paid, discount_amount, note)
SELECT
  tk.payment_date, NULL,
  (SELECT package_id FROM package WHERE product_type='TICKET' LIMIT 1),
  tk.user_id, tk.price, 0, CONCAT('migrated:ticket_payment:', tk.ticket_code)
FROM ticket_payment tk;

-- NOTE: fruit_payment is intentionally NOT migrated (Fruit was dropped). Archive
--       the old table if you still need the history.

-- ─── 4. Entitlements (current access) ───────────────────────────────────────
-- 4a. One ACTIVE membership entitlement per customer, from customer.end_membership_date.
--     [TODO] valid_from: the old model didn't store a stable start; using the last
--            membership payment's start_date below — adjust if you prefer created_at.
INSERT INTO entitlement
  (customer_id, package_id, product_type, access_model, valid_from, valid_until,
   entries_total, entries_used, status, created_at)
SELECT
  c.customer_id,
  (SELECT mp.payment_id FROM member_payment mp WHERE mp.customer_id = c.customer_id
     ORDER BY mp.payment_date DESC LIMIT 1) * 0  -- placeholder; replace with matched package_id [TODO]
   + (SELECT p.package_id FROM package p WHERE p.product_type='MEMBERSHIP' LIMIT 1),
  'MEMBERSHIP', 'TIME',
  (SELECT mp.start_date FROM member_payment mp WHERE mp.customer_id = c.customer_id
     ORDER BY mp.payment_date DESC LIMIT 1),
  c.end_membership_date,
  NULL, 0,
  CASE WHEN c.end_membership_date >= CURDATE() THEN 'ACTIVE' ELSE 'EXPIRED' END,
  NOW()
FROM customer c
WHERE c.end_membership_date IS NOT NULL;

-- 4b. Coupon entitlements from coupon_card (remaining = quantity - used logs).
--     [TODO] If you tracked coupon usage in coupon_log, compute entries_used from it.
INSERT INTO entitlement
  (customer_id, package_id, product_type, access_model, entries_total, entries_used,
   access_code, status, created_at)
SELECT
  cp.customer_id,
  (SELECT p.package_id FROM package p WHERE p.product_type='COUPON' AND p.entry_count = cc.quantity LIMIT 1),
  'COUPON', 'COUNT', cc.quantity, 0, cc.coupon_code,
  CASE WHEN cc.status = 'Pending' THEN 'ACTIVE' ELSE 'USED_UP' END, NOW()
FROM coupon_card cc
JOIN coupon_payment cp ON cp.coupon_code = cc.coupon_code;

-- ─── 5. Check-ins from member_scan ──────────────────────────────────────────
INSERT INTO check_in (check_in_time, customer_id, entitlement_id, facility_id, access_method, note)
SELECT
  ms.date_time, ms.member_id,
  (SELECT e.entitlement_id FROM entitlement e
     WHERE e.customer_id = ms.member_id AND e.product_type='MEMBERSHIP' LIMIT 1),
  NULL, 'RFID', 'migrated:member_scan'
FROM member_scan ms;

-- ─── 6. Verification — old vs new should reconcile ──────────────────────────
-- SELECT
--   (SELECT COUNT(*) FROM member_payment) +
--   (SELECT COUNT(*) FROM coupon_payment) +
--   (SELECT COUNT(*) FROM trainning_payment) +
--   (SELECT COUNT(*) FROM ticket_payment)              AS old_payment_rows,
--   (SELECT COUNT(*) FROM purchase)                    AS new_purchase_rows;
-- SELECT SUM(price) FROM member_payment;   -- compare against SUM(price_paid) in purchase
