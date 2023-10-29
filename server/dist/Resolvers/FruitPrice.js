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
exports.FruitPriceResolver = exports.FruitPriceTableMutationResponse = exports.FruitPriceTableResponse = void 0;
const FruitPrice_1 = require("../Entities/FruitPrice");
const type_graphql_1 = require("type-graphql");
let FruitPriceTableResponse = class FruitPriceTableResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], FruitPriceTableResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], FruitPriceTableResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], FruitPriceTableResponse.prototype, "message", void 0);
FruitPriceTableResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], FruitPriceTableResponse);
exports.FruitPriceTableResponse = FruitPriceTableResponse;
let FruitPriceTableMutationResponse = class FruitPriceTableMutationResponse {
};
FruitPriceTableMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: FruitPriceTableResponse })
], FruitPriceTableMutationResponse);
exports.FruitPriceTableMutationResponse = FruitPriceTableMutationResponse;
let FruitPriceResolver = class FruitPriceResolver {
    async GetFruitPriceTable() {
        return await FruitPrice_1.FruitPrice.find({ order: { id: "ASC" } });
    }
};
__decorate([
    (0, type_graphql_1.Query)((_return) => [FruitPrice_1.FruitPrice]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FruitPriceResolver.prototype, "GetFruitPriceTable", null);
FruitPriceResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], FruitPriceResolver);
exports.FruitPriceResolver = FruitPriceResolver;
//# sourceMappingURL=FruitPrice.js.map