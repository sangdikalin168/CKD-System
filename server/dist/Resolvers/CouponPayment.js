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
exports.CouponPaymentResolver = exports.CouponPaymentMutationResponse = exports.CouponPaymentResponse = void 0;
const type_graphql_1 = require("type-graphql");
const CouponPayment_1 = require("../Entities/CouponPayment");
const CouponCard_1 = require("../Entities/CouponCard");
let CouponPaymentResponse = class CouponPaymentResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CouponPaymentResponse.prototype, "payment_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CouponPaymentResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CouponPaymentResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponPaymentResponse.prototype, "message", void 0);
CouponPaymentResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], CouponPaymentResponse);
exports.CouponPaymentResponse = CouponPaymentResponse;
let CouponPaymentMutationResponse = class CouponPaymentMutationResponse {
};
CouponPaymentMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: CouponPaymentResponse })
], CouponPaymentMutationResponse);
exports.CouponPaymentMutationResponse = CouponPaymentMutationResponse;
let CouponPaymentResolver = class CouponPaymentResolver {
    async GetCouponPayment(customer_Id) {
        return await CouponPayment_1.CouponPayment.find({ where: { customer_id: customer_Id } });
    }
    async CreateCouponPayment(user_id, customer_id, card_name, price, quantity, coupon_code) {
        const result = await CouponPayment_1.CouponPayment.create({
            user_id: user_id,
            customer_id: customer_id,
            card_name: card_name,
            price: price,
            quantity: quantity,
            coupon_code: coupon_code
        }).save();
        if (result.payment_id) {
            const update = await CouponCard_1.CouponCard.update({
                coupon_code: coupon_code,
            }, {
                status: "Sold"
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
    (0, type_graphql_1.Query)((_return) => [CouponPayment_1.CouponPayment]),
    __param(0, (0, type_graphql_1.Arg)("customer_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CouponPaymentResolver.prototype, "GetCouponPayment", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => CouponPaymentMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("user_id")),
    __param(1, (0, type_graphql_1.Arg)("customer_id")),
    __param(2, (0, type_graphql_1.Arg)("card_name")),
    __param(3, (0, type_graphql_1.Arg)("price")),
    __param(4, (0, type_graphql_1.Arg)("quantity")),
    __param(5, (0, type_graphql_1.Arg)("coupon_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], CouponPaymentResolver.prototype, "CreateCouponPayment", null);
CouponPaymentResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CouponPaymentResolver);
exports.CouponPaymentResolver = CouponPaymentResolver;
//# sourceMappingURL=CouponPayment.js.map