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
exports.FruitPaymentResolver = exports.FruitPaymentMutationResponse = exports.FruitPaymentResponse = void 0;
const Customer_1 = require("../Entities/Customer");
const type_graphql_1 = require("type-graphql");
const FruitPayment_1 = require("../Entities/FruitPayment");
let FruitPaymentResponse = class FruitPaymentResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], FruitPaymentResponse.prototype, "payment_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], FruitPaymentResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], FruitPaymentResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], FruitPaymentResponse.prototype, "message", void 0);
FruitPaymentResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], FruitPaymentResponse);
exports.FruitPaymentResponse = FruitPaymentResponse;
let FruitPaymentMutationResponse = class FruitPaymentMutationResponse {
};
FruitPaymentMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: FruitPaymentResponse })
], FruitPaymentMutationResponse);
exports.FruitPaymentMutationResponse = FruitPaymentMutationResponse;
let FruitPaymentResolver = class FruitPaymentResolver {
    async GetFruitPayment(customer_Id) {
        return await FruitPayment_1.FruitPayment.find({ where: { customer_id: customer_Id } });
    }
    async CreateFruitPayment(user_id, customer_id, promotion, price, old_end, new_end, month_qty) {
        const result = await FruitPayment_1.FruitPayment.create({
            user_id: user_id,
            customer_id: customer_id,
            promotion: promotion,
            price: price,
            old_end: old_end,
            new_end: new_end,
            month_qty: month_qty
        }).save();
        if (result.payment_id) {
            const update = await Customer_1.Customer.update({
                customer_id: customer_id,
            }, {
                end_fruit_date: new_end,
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
    (0, type_graphql_1.Query)((_return) => [FruitPayment_1.FruitPayment]),
    __param(0, (0, type_graphql_1.Arg)("customer_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FruitPaymentResolver.prototype, "GetFruitPayment", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => FruitPaymentMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("user_id")),
    __param(1, (0, type_graphql_1.Arg)("customer_id")),
    __param(2, (0, type_graphql_1.Arg)("promotion")),
    __param(3, (0, type_graphql_1.Arg)("price")),
    __param(4, (0, type_graphql_1.Arg)("old_end")),
    __param(5, (0, type_graphql_1.Arg)("new_end")),
    __param(6, (0, type_graphql_1.Arg)("month_qty")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number, String, String, Number]),
    __metadata("design:returntype", Promise)
], FruitPaymentResolver.prototype, "CreateFruitPayment", null);
FruitPaymentResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], FruitPaymentResolver);
exports.FruitPaymentResolver = FruitPaymentResolver;
//# sourceMappingURL=FruitPayment.js.map