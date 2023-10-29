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
exports.MemberPriceTable = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
let MemberPriceTable = class MemberPriceTable extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], MemberPriceTable.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], MemberPriceTable.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], MemberPriceTable.prototype, "age", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], MemberPriceTable.prototype, "member_type", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "float", default: 1 }),
    __metadata("design:type", Number)
], MemberPriceTable.prototype, "month_qty", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "double" }),
    __metadata("design:type", Number)
], MemberPriceTable.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 10, default: "Full" }),
    __metadata("design:type", String)
], MemberPriceTable.prototype, "shift", void 0);
MemberPriceTable = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], MemberPriceTable);
exports.MemberPriceTable = MemberPriceTable;
//# sourceMappingURL=MemberPriceTable.js.map