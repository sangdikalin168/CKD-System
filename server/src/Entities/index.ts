import { CouponCard } from "./CouponCard";
import { CouponPayment } from "./CouponPayment";
import { Customer } from "./Customer";
import { FruitPayment } from "./FruitPayment";
import { FruitPrice } from "./FruitPrice";
import { Hold } from "./Hold";
import { HoldRequest } from "./HoldRequest";
import { MemberPayment } from "./MemberPayment";
import { MemberPriceTable } from "./MemberPriceTable";
import { TicketPayment } from "./TicketPayment";
import { TrainningPayment } from "./TrainningPayment";
import { TrainningPrice } from "./TrainningPrice";
import { Transfer } from "./Transfer";
import { TransferRequest } from "./TransferRequest";
import { Users } from "./Users";

export const entities = [
  Users,
  Customer, MemberPriceTable, MemberPayment, Hold, HoldRequest, Transfer, TransferRequest,
  CouponCard, CouponPayment,
  TrainningPayment, TrainningPrice,
  TicketPayment,
  FruitPayment, FruitPrice
];
