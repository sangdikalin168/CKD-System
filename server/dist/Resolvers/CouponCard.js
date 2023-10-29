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
exports.CouponCardResolver = exports.CouponCardMutationResponse = exports.CouponCardResponse = void 0;
const type_graphql_1 = require("type-graphql");
const CouponCard_1 = require("../Entities/CouponCard");
let CouponCardResponse = class CouponCardResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CouponCardResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CouponCardResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CouponCardResponse.prototype, "message", void 0);
CouponCardResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], CouponCardResponse);
exports.CouponCardResponse = CouponCardResponse;
let CouponCardMutationResponse = class CouponCardMutationResponse {
};
CouponCardMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: CouponCardResponse })
], CouponCardMutationResponse);
exports.CouponCardMutationResponse = CouponCardMutationResponse;
let CouponCardResolver = class CouponCardResolver {
    async GetCouponCard(coupon_code) {
        return await CouponCard_1.CouponCard.find({ where: { coupon_code: coupon_code, status: "Pending" } });
    }
};
__decorate([
    (0, type_graphql_1.Query)((_return) => [CouponCard_1.CouponCard]),
    __param(0, (0, type_graphql_1.Arg)("coupon_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CouponCardResolver.prototype, "GetCouponCard", null);
CouponCardResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CouponCardResolver);
exports.CouponCardResolver = CouponCardResolver;
//# sourceMappingURL=CouponCard.js.map