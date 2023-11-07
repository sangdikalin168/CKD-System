"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberPaymentResolver = exports.MemberPaymentMutationResponse = exports.MemberPaymentResponse = void 0;
const MemberPayment_1 = require("../Entities/MemberPayment");
const Customer_1 = require("../Entities/Customer");
const type_graphql_1 = require("type-graphql");
const Users_1 = require("../Entities/Users");
let MemberPaymentResponse = class MemberPaymentResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], MemberPaymentResponse.prototype, "payment_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], MemberPaymentResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], MemberPaymentResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], MemberPaymentResponse.prototype, "message", void 0);
MemberPaymentResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], MemberPaymentResponse);
exports.MemberPaymentResponse = MemberPaymentResponse;
let MemberPaymentMutationResponse = class MemberPaymentMutationResponse {
};
MemberPaymentMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: MemberPaymentResponse })
], MemberPaymentMutationResponse);
exports.MemberPaymentMutationResponse = MemberPaymentMutationResponse;
let MemberPaymentDetail = class MemberPaymentDetail {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], MemberPaymentDetail.prototype, "payment_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], MemberPaymentDetail.prototype, "payment_date", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], MemberPaymentDetail.prototype, "display_name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], MemberPaymentDetail.prototype, "customer_name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], MemberPaymentDetail.prototype, "phone", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], MemberPaymentDetail.prototype, "promotion", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], MemberPaymentDetail.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], MemberPaymentDetail.prototype, "old_end", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], MemberPaymentDetail.prototype, "new_end", void 0);
MemberPaymentDetail = __decorate([
    (0, type_graphql_1.ObjectType)()
], MemberPaymentDetail);
let MemberPaymentResolver = class MemberPaymentResolver {
    async GetMemberPayment(customer_Id) {
        return await MemberPayment_1.MemberPayment.find({ where: { customer_id: customer_Id } });
    }
    async MemberPaymentDetail(payment_id) {
        const res = await MemberPayment_1.MemberPayment.createQueryBuilder("member_payment")
            .innerJoin(Users_1.Users, "user", "member_payment.user_id = user.user_id")
            .innerJoin(Customer_1.Customer, "customer", "member_payment.customer_id = customer.customer_id")
            .select(["payment_id", "payment_date", "user.display_name as display_name", "customer_name", "customer.phone as phone", "promotion", "price", "old_end", "new_end"])
            .where("payment_id = :payment_id", { payment_id: payment_id })
            .getRawOne();
        return res;
    }
    async CreateCustomerPayment(user_id, customer_id, promotion, price, old_end, new_end, shift, month_qty) {
        const result = await MemberPayment_1.MemberPayment.create({
            user_id: user_id,
            customer_id: customer_id,
            promotion: promotion,
            price: price,
            old_end: old_end,
            new_end: new_end,
            shift: shift,
            month_qty: month_qty
        }).save();
        if (result.payment_id) {
            const update = await Customer_1.Customer.update({
                customer_id: customer_id,
            }, {
                end_membership_date: new_end,
                shift: shift,
            });
            if (update.affected) {
                return {
                    payment_id: result.payment_id,
                    code: 200,
                    success: true,
                    message: "Update Member Success",
                };
            }
            return {
                payment_id: 0,
                code: 200,
                success: false,
                message: "Invoice Create Failed",
            };
        }
        return {
            payment_id: 0,
            code: 200,
            success: false,
            message: "Invoice Create Failed",
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)((_return) => [MemberPayment_1.MemberPayment]),
    __param(0, (0, type_graphql_1.Arg)("customer_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MemberPaymentResolver.prototype, "GetMemberPayment", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => MemberPaymentDetail),
    __param(0, (0, type_graphql_1.Arg)("payment_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MemberPaymentResolver.prototype, "MemberPaymentDetail", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => MemberPaymentMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("user_id")),
    __param(1, (0, type_graphql_1.Arg)("customer_id")),
    __param(2, (0, type_graphql_1.Arg)("promotion")),
    __param(3, (0, type_graphql_1.Arg)("price")),
    __param(4, (0, type_graphql_1.Arg)("old_end")),
    __param(5, (0, type_graphql_1.Arg)("new_end")),
    __param(6, (0, type_graphql_1.Arg)("shift")),
    __param(7, (0, type_graphql_1.Arg)("month_qty")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], MemberPaymentResolver.prototype, "CreateCustomerPayment", null);
MemberPaymentResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MemberPaymentResolver);
exports.MemberPaymentResolver = MemberPaymentResolver;
//# sourceMappingURL=MemberPayment.js.map