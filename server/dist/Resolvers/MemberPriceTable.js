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
exports.MemberPriceTableResolver = exports.MemberPriceTableMutationResponse = exports.IMemberPriceTableResponse = void 0;
const MemberPriceTable_1 = require("../Entities/MemberPriceTable");
const type_graphql_1 = require("type-graphql");
let IMemberPriceTableResponse = class IMemberPriceTableResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], IMemberPriceTableResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], IMemberPriceTableResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IMemberPriceTableResponse.prototype, "message", void 0);
IMemberPriceTableResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], IMemberPriceTableResponse);
exports.IMemberPriceTableResponse = IMemberPriceTableResponse;
let MemberPriceTableMutationResponse = class MemberPriceTableMutationResponse {
};
MemberPriceTableMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: IMemberPriceTableResponse })
], MemberPriceTableMutationResponse);
exports.MemberPriceTableMutationResponse = MemberPriceTableMutationResponse;
let MemberPriceTableResolver = class MemberPriceTableResolver {
    async GetMemberPriceTable() {
        return await MemberPriceTable_1.MemberPriceTable.find({ order: { id: "ASC" } });
    }
};
__decorate([
    (0, type_graphql_1.Query)((_return) => [MemberPriceTable_1.MemberPriceTable]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberPriceTableResolver.prototype, "GetMemberPriceTable", null);
MemberPriceTableResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MemberPriceTableResolver);
exports.MemberPriceTableResolver = MemberPriceTableResolver;
//# sourceMappingURL=MemberPriceTable.js.map