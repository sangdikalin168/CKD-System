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
exports.TranningPaymentResolver = exports.TrainningPaymentMutationResponse = exports.TrainningPaymentResponse = void 0;
const type_graphql_1 = require("type-graphql");
const TrainningPayment_1 = require("../Entities/TrainningPayment");
let TrainningPaymentResponse = class TrainningPaymentResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], TrainningPaymentResponse.prototype, "payment_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], TrainningPaymentResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], TrainningPaymentResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], TrainningPaymentResponse.prototype, "message", void 0);
TrainningPaymentResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], TrainningPaymentResponse);
exports.TrainningPaymentResponse = TrainningPaymentResponse;
let TrainningPaymentMutationResponse = class TrainningPaymentMutationResponse {
};
TrainningPaymentMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: TrainningPaymentResponse })
], TrainningPaymentMutationResponse);
exports.TrainningPaymentMutationResponse = TrainningPaymentMutationResponse;
let TranningPaymentResolver = class TranningPaymentResolver {
    async GetTrainningPayment(customer_Id) {
        return await TrainningPayment_1.TrainningPayment.find({ where: { customer_id: customer_Id } });
    }
    async CreateTrainningPayment(user_id, customer_id, promotion, price, type) {
        const result = await TrainningPayment_1.TrainningPayment.create({
            user_id: user_id,
            customer_id: customer_id,
            promotion: promotion,
            price: price,
            type: type,
        }).save();
        if (result.payment_id) {
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
};
__decorate([
    (0, type_graphql_1.Query)((_return) => [TrainningPayment_1.TrainningPayment]),
    __param(0, (0, type_graphql_1.Arg)("customer_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TranningPaymentResolver.prototype, "GetTrainningPayment", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => TrainningPaymentMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("user_id")),
    __param(1, (0, type_graphql_1.Arg)("customer_id")),
    __param(2, (0, type_graphql_1.Arg)("promotion")),
    __param(3, (0, type_graphql_1.Arg)("price")),
    __param(4, (0, type_graphql_1.Arg)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, Number, String]),
    __metadata("design:returntype", Promise)
], TranningPaymentResolver.prototype, "CreateTrainningPayment", null);
TranningPaymentResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], TranningPaymentResolver);
exports.TranningPaymentResolver = TranningPaymentResolver;
//# sourceMappingURL=TranningPayment.js.map