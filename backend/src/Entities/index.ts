// Unified Product / Purchase / Entitlement model (docs/db-redesign.md), running
// ALONGSIDE the legacy tables during the dual-write transition. All entities below
// use TypeORM active-record (Entity.find()/.save()), so every one that any resolver
// touches MUST be registered here — otherwise "DataSource is not set for this entity".

// Core + workflow
import { Users } from "./Users";
import { Customer } from "./Customer";
import { Hold } from "./Hold";
import { HoldRequest } from "./HoldRequest";
import { Transfer } from "./Transfer";
import { TransferRequest } from "./TransferRequest";

// New unified model
import { Facility } from "./Facility";
import { Package } from "./Package";
import { PackageFacility } from "./PackageFacility";
import { Purchase } from "./Purchase";
import { Entitlement } from "./Entitlement";
import { CheckIn } from "./CheckIn";

// Legacy tables (still read/written by existing resolvers during the transition)
import { MemberScan } from "./MemberScan";
import { MemberPriceTable } from "./MemberPriceTable";
import { MemberPayment } from "./MemberPayment";
import { CouponCard } from "./CouponCard";
import { CouponPayment } from "./CouponPayment";
import { TrainningPayment } from "./TrainningPayment";
import { TrainningPrice } from "./TrainningPrice";
import { TicketPayment } from "./TicketPayment";
import { TicketPriceConfig } from "./TicketPriceConfig";
import { FruitPayment } from "./FruitPayment";
import { FruitPrice } from "./FruitPrice";

// Ensure registerEnumType() runs for the GraphQL schema.
import "./enums";

export const entities = [
  Users,
  Customer,
  // workflow
  Hold, HoldRequest, Transfer, TransferRequest,
  // new unified model
  Facility, Package, PackageFacility, Purchase, Entitlement, CheckIn,
  // legacy (dual-write transition)
  MemberScan, MemberPriceTable, MemberPayment,
  CouponCard, CouponPayment,
  TrainningPayment, TrainningPrice,
  TicketPayment, TicketPriceConfig,
  FruitPayment, FruitPrice,
];
