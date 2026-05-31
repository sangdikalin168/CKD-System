-- Seed all member prices from the price list image
-- Run this AFTER restarting the backend (so TypeORM adds the new serviceType column)
-- Usage: mysql -u <user> -p <dbname> < scripts/seed-prices.sql

TRUNCATE TABLE member_price_table;

-- ─── Full Price ──────────────────────────────────────────────────────────────
-- SWIM
INSERT INTO member_price_table (description, ageGroup, customerType, serviceType, shift, monthQty, price, entryQty) VALUES
('ហែលទឹក ពេញ 1ខែ ធំ ($40)',   'Adult', 'Full', 'Swim', 'Full', 1,  40,  1),
('ហែលទឹក ពេញ 3ខែ ធំ ($105)',  'Adult', 'Full', 'Swim', 'Full', 3,  105, 1),
('ហែលទឹក ពេញ 6ខែ ធំ ($190)',  'Adult', 'Full', 'Swim', 'Full', 6,  190, 1),
('ហែលទឹក ពេញ 12ខែ ធំ ($280)', 'Adult', 'Full', 'Swim', 'Full', 12, 280, 1),
('ហែលទឹក ពេញ 1ខែ តូច ($35)',  'Kid',   'Full', 'Swim', 'Full', 1,  35,  1),
('ហែលទឹក ពេញ 3ខែ តូច ($95)',  'Kid',   'Full', 'Swim', 'Full', 3,  95,  1),
('ហែលទឹក ពេញ 6ខែ តូច ($170)', 'Kid',   'Full', 'Swim', 'Full', 6,  170, 1),
('ហែលទឹក ពេញ 12ខែ តូច ($240)','Kid',   'Full', 'Swim', 'Full', 12, 240, 1),

-- SWIM+Gym
('ហែលទឹក+Gym ពេញ 1ខែ ធំ ($50)',   'Adult', 'Full', 'SwimGym', 'Full', 1,  50,  1),
('ហែលទឹក+Gym ពេញ 3ខែ ធំ ($135)',  'Adult', 'Full', 'SwimGym', 'Full', 3,  135, 1),
('ហែលទឹក+Gym ពេញ 6ខែ ធំ ($250)',  'Adult', 'Full', 'SwimGym', 'Full', 6,  250, 1),
('ហែលទឹក+Gym ពេញ 12ខែ ធំ ($400)', 'Adult', 'Full', 'SwimGym', 'Full', 12, 400, 1),
('ហែលទឹក+Gym ពេញ 1ខែ តូច ($45)',  'Kid',   'Full', 'SwimGym', 'Full', 1,  45,  1),
('ហែលទឹក+Gym ពេញ 3ខែ តូច ($115)', 'Kid',   'Full', 'SwimGym', 'Full', 3,  115, 1),
('ហែលទឹក+Gym ពេញ 6ខែ តូច ($210)', 'Kid',   'Full', 'SwimGym', 'Full', 6,  210, 1),
('ហែលទឹក+Gym ពេញ 12ខែ តូច ($320)','Kid',   'Full', 'SwimGym', 'Full', 12, 320, 1),

-- SWIM+Steam-Sauna
('ហែលទឹក+Steam ពេញ 1ខែ ធំ ($50)',   'Adult', 'Full', 'SwimSteam', 'Full', 1,  50,  1),
('ហែលទឹក+Steam ពេញ 3ខែ ធំ ($135)',  'Adult', 'Full', 'SwimSteam', 'Full', 3,  135, 1),
('ហែលទឹក+Steam ពេញ 6ខែ ធំ ($250)',  'Adult', 'Full', 'SwimSteam', 'Full', 6,  250, 1),
('ហែលទឹក+Steam ពេញ 12ខែ ធំ ($400)', 'Adult', 'Full', 'SwimSteam', 'Full', 12, 400, 1),
('ហែលទឹក+Steam ពេញ 1ខែ តូច ($45)',  'Kid',   'Full', 'SwimSteam', 'Full', 1,  45,  1),
('ហែលទឹក+Steam ពេញ 3ខែ តូច ($115)', 'Kid',   'Full', 'SwimSteam', 'Full', 3,  115, 1),
('ហែលទឹក+Steam ពេញ 6ខែ តូច ($210)', 'Kid',   'Full', 'SwimSteam', 'Full', 6,  210, 1),
('ហែលទឹក+Steam ពេញ 12ខែ តូច ($320)','Kid',   'Full', 'SwimSteam', 'Full', 12, 320, 1),

-- SWIM+Gym+Steam-Sauna
('ហែលទឹក+Gym+Steam ពេញ 1ខែ ធំ ($70)',   'Adult', 'Full', 'SwimGymSteam', 'Full', 1,  70,  1),
('ហែលទឹក+Gym+Steam ពេញ 3ខែ ធំ ($190)',  'Adult', 'Full', 'SwimGymSteam', 'Full', 3,  190, 1),
('ហែលទឹក+Gym+Steam ពេញ 6ខែ ធំ ($360)',  'Adult', 'Full', 'SwimGymSteam', 'Full', 6,  360, 1),
('ហែលទឹក+Gym+Steam ពេញ 12ខែ ធំ ($620)', 'Adult', 'Full', 'SwimGymSteam', 'Full', 12, 620, 1),
('ហែលទឹក+Gym+Steam ពេញ 1ខែ តូច ($60)',  'Kid',   'Full', 'SwimGymSteam', 'Full', 1,  60,  1),
('ហែលទឹក+Gym+Steam ពេញ 3ខែ តូច ($160)', 'Kid',   'Full', 'SwimGymSteam', 'Full', 3,  160, 1),
('ហែលទឹក+Gym+Steam ពេញ 6ខែ តូច ($300)', 'Kid',   'Full', 'SwimGymSteam', 'Full', 6,  300, 1),
('ហែលទឹក+Gym+Steam ពេញ 12ខែ តូច ($500)','Kid',   'Full', 'SwimGymSteam', 'Full', 12, 500, 1),

-- ─── Discount for Existing Members (Old) ─────────────────────────────────────
-- SWIM
('ហែលទឹក ចាស់ 1ខែ ធំ ($30)',   'Adult', 'Old', 'Swim', 'Full', 1,  30,  1),
('ហែលទឹក ចាស់ 3ខែ ធំ ($80)',   'Adult', 'Old', 'Swim', 'Full', 3,  80,  1),
('ហែលទឹក ចាស់ 6ខែ ធំ ($140)',  'Adult', 'Old', 'Swim', 'Full', 6,  140, 1),
('ហែលទឹក ចាស់ 12ខែ ធំ ($210)', 'Adult', 'Old', 'Swim', 'Full', 12, 210, 1),
('ហែលទឹក ចាស់ 1ខែ តូច ($27)',  'Kid',   'Old', 'Swim', 'Full', 1,  27,  1),
('ហែលទឹក ចាស់ 3ខែ តូច ($75)',  'Kid',   'Old', 'Swim', 'Full', 3,  75,  1),
('ហែលទឹក ចាស់ 6ខែ តូច ($125)', 'Kid',   'Old', 'Swim', 'Full', 6,  125, 1),
('ហែលទឹក ចាស់ 12ខែ តូច ($190)','Kid',   'Old', 'Swim', 'Full', 12, 190, 1),

-- SWIM+Gym
('ហែលទឹក+Gym ចាស់ 1ខែ ធំ ($36)',   'Adult', 'Old', 'SwimGym', 'Full', 1,  36,  1),
('ហែលទឹក+Gym ចាស់ 3ខែ ធំ ($100)',  'Adult', 'Old', 'SwimGym', 'Full', 3,  100, 1),
('ហែលទឹក+Gym ចាស់ 6ខែ ធំ ($180)',  'Adult', 'Old', 'SwimGym', 'Full', 6,  180, 1),
('ហែលទឹក+Gym ចាស់ 12ខែ ធំ ($240)', 'Adult', 'Old', 'SwimGym', 'Full', 12, 240, 1),
('ហែលទឹក+Gym ចាស់ 1ខែ តូច ($33)',  'Kid',   'Old', 'SwimGym', 'Full', 1,  33,  1),
('ហែលទឹក+Gym ចាស់ 3ខែ តូច ($85)',  'Kid',   'Old', 'SwimGym', 'Full', 3,  85,  1),
('ហែលទឹក+Gym ចាស់ 6ខែ តូច ($145)', 'Kid',   'Old', 'SwimGym', 'Full', 6,  145, 1),
('ហែលទឹក+Gym ចាស់ 12ខែ តូច ($210)','Kid',   'Old', 'SwimGym', 'Full', 12, 210, 1),

-- SWIM+Steam-Sauna
('ហែលទឹក+Steam ចាស់ 1ខែ ធំ ($36)',   'Adult', 'Old', 'SwimSteam', 'Full', 1,  36,  1),
('ហែលទឹក+Steam ចាស់ 3ខែ ធំ ($100)',  'Adult', 'Old', 'SwimSteam', 'Full', 3,  100, 1),
('ហែលទឹក+Steam ចាស់ 6ខែ ធំ ($180)',  'Adult', 'Old', 'SwimSteam', 'Full', 6,  180, 1),
('ហែលទឹក+Steam ចាស់ 12ខែ ធំ ($240)', 'Adult', 'Old', 'SwimSteam', 'Full', 12, 240, 1),
('ហែលទឹក+Steam ចាស់ 1ខែ តូច ($33)',  'Kid',   'Old', 'SwimSteam', 'Full', 1,  33,  1),
('ហែលទឹក+Steam ចាស់ 3ខែ តូច ($85)',  'Kid',   'Old', 'SwimSteam', 'Full', 3,  85,  1),
('ហែលទឹក+Steam ចាស់ 6ខែ តូច ($145)', 'Kid',   'Old', 'SwimSteam', 'Full', 6,  145, 1),
('ហែលទឹក+Steam ចាស់ 12ខែ តូច ($210)','Kid',   'Old', 'SwimSteam', 'Full', 12, 210, 1),

-- SWIM+Gym+Steam-Sauna
('ហែលទឹក+Gym+Steam ចាស់ 1ខែ ធំ ($42)',   'Adult', 'Old', 'SwimGymSteam', 'Full', 1,  42,  1),
('ហែលទឹក+Gym+Steam ចាស់ 3ខែ ធំ ($110)',  'Adult', 'Old', 'SwimGymSteam', 'Full', 3,  110, 1),
('ហែលទឹក+Gym+Steam ចាស់ 6ខែ ធំ ($200)',  'Adult', 'Old', 'SwimGymSteam', 'Full', 6,  200, 1),
('ហែលទឹក+Gym+Steam ចាស់ 12ខែ ធំ ($290)', 'Adult', 'Old', 'SwimGymSteam', 'Full', 12, 290, 1),
('ហែលទឹក+Gym+Steam ចាស់ 1ខែ តូច ($39)',  'Kid',   'Old', 'SwimGymSteam', 'Full', 1,  39,  1),
('ហែលទឹក+Gym+Steam ចាស់ 3ខែ តូច ($100)', 'Kid',   'Old', 'SwimGymSteam', 'Full', 3,  100, 1),
('ហែលទឹក+Gym+Steam ចាស់ 6ខែ តូច ($180)', 'Kid',   'Old', 'SwimGymSteam', 'Full', 6,  180, 1),
('ហែលទឹក+Gym+Steam ចាស់ 12ខែ តូច ($240)','Kid',   'Old', 'SwimGymSteam', 'Full', 12, 240, 1),

-- ─── Discount for New Members (New) ──────────────────────────────────────────
-- SWIM
('ហែលទឹក ថ្មី 1ខែ ធំ ($33)',   'Adult', 'New', 'Swim', 'Full', 1,  33,  1),
('ហែលទឹក ថ្មី 3ខែ ធំ ($85)',   'Adult', 'New', 'Swim', 'Full', 3,  85,  1),
('ហែលទឹក ថ្មី 6ខែ ធំ ($145)',  'Adult', 'New', 'Swim', 'Full', 6,  145, 1),
('ហែលទឹក ថ្មី 12ខែ ធំ ($220)', 'Adult', 'New', 'Swim', 'Full', 12, 220, 1),
('ហែលទឹក ថ្មី 1ខែ តូច ($30)',  'Kid',   'New', 'Swim', 'Full', 1,  30,  1),
('ហែលទឹក ថ្មី 3ខែ តូច ($80)',  'Kid',   'New', 'Swim', 'Full', 3,  80,  1),
('ហែលទឹក ថ្មី 6ខែ តូច ($130)', 'Kid',   'New', 'Swim', 'Full', 6,  130, 1),
('ហែលទឹក ថ្មី 12ខែ តូច ($200)','Kid',   'New', 'Swim', 'Full', 12, 200, 1),

-- SWIM+Gym
('ហែលទឹក+Gym ថ្មី 1ខែ ធំ ($39)',   'Adult', 'New', 'SwimGym', 'Full', 1,  39,  1),
('ហែលទឹក+Gym ថ្មី 3ខែ ធំ ($110)',  'Adult', 'New', 'SwimGym', 'Full', 3,  110, 1),
('ហែលទឹក+Gym ថ្មី 6ខែ ធំ ($190)',  'Adult', 'New', 'SwimGym', 'Full', 6,  190, 1),
('ហែលទឹក+Gym ថ្មី 12ខែ ធំ ($250)', 'Adult', 'New', 'SwimGym', 'Full', 12, 250, 1),
('ហែលទឹក+Gym ថ្មី 1ខែ តូច ($36)',  'Kid',   'New', 'SwimGym', 'Full', 1,  36,  1),
('ហែលទឹក+Gym ថ្មី 3ខែ តូច ($90)',  'Kid',   'New', 'SwimGym', 'Full', 3,  90,  1),
('ហែលទឹក+Gym ថ្មី 6ខែ តូច ($150)', 'Kid',   'New', 'SwimGym', 'Full', 6,  150, 1),
('ហែលទឹក+Gym ថ្មី 12ខែ តូច ($220)','Kid',   'New', 'SwimGym', 'Full', 12, 220, 1),

-- SWIM+Steam-Sauna
('ហែលទឹក+Steam ថ្មី 1ខែ ធំ ($39)',   'Adult', 'New', 'SwimSteam', 'Full', 1,  39,  1),
('ហែលទឹក+Steam ថ្មី 3ខែ ធំ ($110)',  'Adult', 'New', 'SwimSteam', 'Full', 3,  110, 1),
('ហែលទឹក+Steam ថ្មី 6ខែ ធំ ($190)',  'Adult', 'New', 'SwimSteam', 'Full', 6,  190, 1),
('ហែលទឹក+Steam ថ្មី 12ខែ ធំ ($250)', 'Adult', 'New', 'SwimSteam', 'Full', 12, 250, 1),
('ហែលទឹក+Steam ថ្មី 1ខែ តូច ($36)',  'Kid',   'New', 'SwimSteam', 'Full', 1,  36,  1),
('ហែលទឹក+Steam ថ្មី 3ខែ តូច ($90)',  'Kid',   'New', 'SwimSteam', 'Full', 3,  90,  1),
('ហែលទឹក+Steam ថ្មី 6ខែ តូច ($150)', 'Kid',   'New', 'SwimSteam', 'Full', 6,  150, 1),
('ហែលទឹក+Steam ថ្មី 12ខែ តូច ($220)','Kid',   'New', 'SwimSteam', 'Full', 12, 220, 1),

-- SWIM+Gym+Steam-Sauna
('ហែលទឹក+Gym+Steam ថ្មី 1ខែ ធំ ($45)',   'Adult', 'New', 'SwimGymSteam', 'Full', 1,  45,  1),
('ហែលទឹក+Gym+Steam ថ្មី 3ខែ ធំ ($115)',  'Adult', 'New', 'SwimGymSteam', 'Full', 3,  115, 1),
('ហែលទឹក+Gym+Steam ថ្មី 6ខែ ធំ ($210)',  'Adult', 'New', 'SwimGymSteam', 'Full', 6,  210, 1),
('ហែលទឹក+Gym+Steam ថ្មី 12ខែ ធំ ($310)', 'Adult', 'New', 'SwimGymSteam', 'Full', 12, 310, 1),
('ហែលទឹក+Gym+Steam ថ្មី 1ខែ តូច ($42)',  'Kid',   'New', 'SwimGymSteam', 'Full', 1,  42,  1),
('ហែលទឹក+Gym+Steam ថ្មី 3ខែ តូច ($105)', 'Kid',   'New', 'SwimGymSteam', 'Full', 3,  105, 1),
('ហែលទឹក+Gym+Steam ថ្មី 6ខែ តូច ($190)', 'Kid',   'New', 'SwimGymSteam', 'Full', 6,  190, 1),
('ហែលទឹក+Gym+Steam ថ្មី 12ខែ តូច ($260)','Kid',   'New', 'SwimGymSteam', 'Full', 12, 260, 1);
