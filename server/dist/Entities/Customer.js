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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
let Customer = class Customer extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Customer.prototype, "customer_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "date", default: () => "CURRENT_DATE" }),
    __metadata("design:type", String)
], Customer.prototype, "created_date", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Customer.prototype, "created_by", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "customer_code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "customer_name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "gender", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Customer.prototype, "image_path", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 2000 }),
    __metadata("design:type", String)
], Customer.prototype, "fingerprint", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "date", default: () => "CURRENT_DATE" }),
    __metadata("design:type", String)
], Customer.prototype, "end_membership_date", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ type: "date", default: () => "CURRENT_DATE" }),
    __metadata("design:type", String)
], Customer.prototype, "end_fruit_date", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 10, default: "un_take" }),
    __metadata("design:type", String)
], Customer.prototype, "key_status", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 10, default: "un_take" }),
    __metadata("design:type", String)
], Customer.prototype, "towel_status", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 20, default: "Full" }),
    __metadata("design:type", String)
], Customer.prototype, "shift", void 0);
Customer = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], Customer);
exports.Customer = Customer;
//# sourceMappingURL=Customer.js.map