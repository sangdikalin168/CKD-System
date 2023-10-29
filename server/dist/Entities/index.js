"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entities = void 0;
const CouponCard_1 = require("./CouponCard");
const CouponPayment_1 = require("./CouponPayment");
const Customer_1 = require("./Customer");
const FruitPayment_1 = require("./FruitPayment");
const FruitPrice_1 = require("./FruitPrice");
const MemberPayment_1 = require("./MemberPayment");
const MemberPriceTable_1 = require("./MemberPriceTable");
const TicketPayment_1 = require("./TicketPayment");
const TrainningPayment_1 = require("./TrainningPayment");
const TrainningPrice_1 = require("./TrainningPrice");
const Users_1 = require("./Users");
exports.entities = [
    Users_1.Users,
    Customer_1.Customer, MemberPriceTable_1.MemberPriceTable, MemberPayment_1.MemberPayment,
    CouponCard_1.CouponCard, CouponPayment_1.CouponPayment,
    TrainningPayment_1.TrainningPayment, TrainningPrice_1.TrainningPrice,
    TicketPayment_1.TicketPayment,
    FruitPayment_1.FruitPayment, FruitPrice_1.FruitPrice
];
//# sourceMappingURL=index.js.map