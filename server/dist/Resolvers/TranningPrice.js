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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranningPriceResolver = exports.TranningPriceMutationResponse = exports.TranningPriceResponse = void 0;
const TrainningPrice_1 = require("../Entities/TrainningPrice");
const type_graphql_1 = require("type-graphql");
let TranningPriceResponse = class TranningPriceResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], TranningPriceResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], TranningPriceResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], TranningPriceResponse.prototype, "message", void 0);
TranningPriceResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], TranningPriceResponse);
exports.TranningPriceResponse = TranningPriceResponse;
let TranningPriceMutationResponse = class TranningPriceMutationResponse {
};
TranningPriceMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: TranningPriceResponse })
], TranningPriceMutationResponse);
exports.TranningPriceMutationResponse = TranningPriceMutationResponse;
let TranningPriceResolver = class TranningPriceResolver {
    async GetTranningPrice() {
        return await TrainningPrice_1.TrainningPrice.find({ order: { id: "ASC" } });
    }
};
__decorate([
    (0, type_graphql_1.Query)((_return) => [TrainningPrice_1.TrainningPrice]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TranningPriceResolver.prototype, "GetTranningPrice", null);
TranningPriceResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], TranningPriceResolver);
exports.TranningPriceResolver = TranningPriceResolver;
//# sourceMappingURL=TranningPrice.js.map