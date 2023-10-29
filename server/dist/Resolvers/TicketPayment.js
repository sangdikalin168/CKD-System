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
exports.TicketPaymentResolver = exports.TicketPaymentMutationResponse = exports.TicketPaymentResponse = void 0;
const type_graphql_1 = require("type-graphql");
const TicketPayment_1 = require("../Entities/TicketPayment");
let TicketPaymentResponse = class TicketPaymentResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], TicketPaymentResponse.prototype, "payment_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], TicketPaymentResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], TicketPaymentResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], TicketPaymentResponse.prototype, "message", void 0);
TicketPaymentResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], TicketPaymentResponse);
exports.TicketPaymentResponse = TicketPaymentResponse;
let TicketPaymentMutationResponse = class TicketPaymentMutationResponse {
};
TicketPaymentMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: TicketPaymentResponse })
], TicketPaymentMutationResponse);
exports.TicketPaymentMutationResponse = TicketPaymentMutationResponse;
let TicketPaymentResolver = class TicketPaymentResolver {
    async CreateTicketPayment(user_id, price, ticket_code) {
        const result = await TicketPayment_1.TicketPayment.create({
            user_id: user_id,
            ticket_code: ticket_code,
            price: price,
        }).save();
        if (result.payment_id) {
            return {
                payment_id: result.payment_id,
                code: 200,
                success: true,
                message: "Ticket Insert Success",
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
    (0, type_graphql_1.Mutation)((_return) => TicketPaymentMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("user_id")),
    __param(1, (0, type_graphql_1.Arg)("price")),
    __param(2, (0, type_graphql_1.Arg)("ticket_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], TicketPaymentResolver.prototype, "CreateTicketPayment", null);
TicketPaymentResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], TicketPaymentResolver);
exports.TicketPaymentResolver = TicketPaymentResolver;
//# sourceMappingURL=TicketPayment.js.map