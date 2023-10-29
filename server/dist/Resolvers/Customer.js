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
exports.CustomerResolver = exports.CustomerMutationResponse = exports.ICustomerResponse = void 0;
const Customer_1 = require("../Entities/Customer");
const type_graphql_1 = require("type-graphql");
let ICustomerResponse = class ICustomerResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], ICustomerResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], ICustomerResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ICustomerResponse.prototype, "message", void 0);
ICustomerResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], ICustomerResponse);
exports.ICustomerResponse = ICustomerResponse;
let CustomerMutationResponse = class CustomerMutationResponse {
};
CustomerMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: ICustomerResponse })
], CustomerMutationResponse);
exports.CustomerMutationResponse = CustomerMutationResponse;
let CustomerResolver = class CustomerResolver {
    async GetCustomers() {
        return await Customer_1.Customer.find({ order: { customer_id: "DESC" } });
    }
    async GetCustomerDetail(customer_Id) {
        return await Customer_1.Customer.find({ where: { customer_id: customer_Id } });
    }
    async CreateCustomer(customer_name, phone, gender, created_by) {
        const isExist = await Customer_1.Customer.findOne({
            where: [{ customer_name: customer_name }, { phone: phone }],
        });
        if (isExist) {
            return {
                code: 400,
                success: false,
                message: "Already Exist",
            };
        }
        await Customer_1.Customer.create({
            customer_name: customer_name,
            phone: phone,
            gender: gender,
            created_by: created_by
        }).save();
        return {
            code: 200,
            success: true,
            message: "Create Success",
        };
    }
    async UpdateCustomer(customer_id, phone) {
        const existPhone = await Customer_1.Customer.findOne({ where: { phone: phone } });
        if (existPhone === null || existPhone === void 0 ? void 0 : existPhone.customer_id) {
            return {
                code: 200,
                success: false,
                message: "លេខនេះមានរួចហើយ!!!",
            };
        }
        const update = await Customer_1.Customer.update({
            customer_id: customer_id,
        }, {
            phone: phone
        });
        if (update.affected) {
            return {
                code: 200,
                success: true,
                message: "Update Member Success",
            };
        }
        return {
            code: 200,
            success: false,
            message: "Update Member Failed",
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)((_return) => [Customer_1.Customer]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "GetCustomers", null);
__decorate([
    (0, type_graphql_1.Query)((_return) => [Customer_1.Customer]),
    __param(0, (0, type_graphql_1.Arg)("customer_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "GetCustomerDetail", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => CustomerMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("customer_name")),
    __param(1, (0, type_graphql_1.Arg)("phone")),
    __param(2, (0, type_graphql_1.Arg)("gender")),
    __param(3, (0, type_graphql_1.Arg)("created_by")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "CreateCustomer", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => CustomerMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("customer_id")),
    __param(1, (0, type_graphql_1.Arg)("phone")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], CustomerResolver.prototype, "UpdateCustomer", null);
CustomerResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CustomerResolver);
exports.CustomerResolver = CustomerResolver;
//# sourceMappingURL=Customer.js.map