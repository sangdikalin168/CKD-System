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
exports.UserResolver = exports.UserMutationResponse = exports.IMutationResponse = exports.LoginInput = void 0;
const type_graphql_1 = require("type-graphql");
const Users_1 = require("../Entities/Users");
const GetUser_1 = require("../Types/GetUser");
const bcryptjs_1 = require("bcryptjs");
const auth_1 = require("../utils/auth");
const RegisterInput_1 = require("../Types/RegisterInput");
const type_graphql_2 = require("type-graphql");
let LoginInput = class LoginInput {
};
__decorate([
    (0, type_graphql_2.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "username", void 0);
__decorate([
    (0, type_graphql_2.Field)(),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
LoginInput = __decorate([
    (0, type_graphql_2.InputType)()
], LoginInput);
exports.LoginInput = LoginInput;
let IMutationResponse = class IMutationResponse {
};
__decorate([
    (0, type_graphql_2.Field)(),
    __metadata("design:type", Number)
], IMutationResponse.prototype, "code", void 0);
__decorate([
    (0, type_graphql_2.Field)(),
    __metadata("design:type", Boolean)
], IMutationResponse.prototype, "success", void 0);
__decorate([
    (0, type_graphql_2.Field)({ nullable: true }),
    __metadata("design:type", String)
], IMutationResponse.prototype, "message", void 0);
IMutationResponse = __decorate([
    (0, type_graphql_1.InterfaceType)()
], IMutationResponse);
exports.IMutationResponse = IMutationResponse;
let UserMutationResponse = class UserMutationResponse {
};
__decorate([
    (0, type_graphql_2.Field)({ nullable: true }),
    __metadata("design:type", Users_1.Users)
], UserMutationResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_2.Field)({ nullable: true }),
    __metadata("design:type", String)
], UserMutationResponse.prototype, "accessToken", void 0);
UserMutationResponse = __decorate([
    (0, type_graphql_1.ObjectType)({ implements: IMutationResponse })
], UserMutationResponse);
exports.UserMutationResponse = UserMutationResponse;
let UserResolver = class UserResolver {
    async users() {
        return await Users_1.Users.find({ order: { user_id: "DESC" } });
    }
    async get_user(user_id) {
        const user = await Users_1.Users.findOne({ where: { user_id: user_id } });
        return user;
    }
    async create_user({ username, password, display_name, phone, role }, {}) {
        const existingUser = await Users_1.Users.findOne({
            where: [{ username: username }, { phone: phone }],
        });
        if (existingUser) {
            return {
                code: 400,
                success: false,
                message: "User Already Register",
            };
        }
        const hashedPassword = await (0, bcryptjs_1.hash)(password, 12);
        await Users_1.Users.insert({
            username,
            password: hashedPassword,
            phone,
            display_name,
            role,
        });
        return {
            code: 200,
            success: true,
            message: "User Create Success",
        };
    }
    async login({ username, password }, { res }) {
        const existingUser = await Users_1.Users.findOne({
            where: [{ username: username }, { phone: username }],
        });
        if (!existingUser) {
            return {
                code: 400,
                success: false,
                message: "User not found",
            };
        }
        const isPasswordValid = await (0, bcryptjs_1.compare)(password, existingUser.password);
        if (!isPasswordValid) {
            return {
                code: 400,
                success: false,
                message: "Incorrect password",
            };
        }
        (0, auth_1.sendRefreshToken)(res, existingUser);
        return {
            code: 200,
            success: true,
            message: "Logged in successfully",
            user: existingUser,
            accessToken: (0, auth_1.createToken)("accessToken", existingUser),
        };
    }
    async logout(user_id, { res }) {
        const existingUser = await Users_1.Users.findOne({ where: { user_id: user_id } });
        if (!existingUser) {
            return {
                code: 400,
                success: false,
            };
        }
        existingUser.tokenVersion += 1;
        await existingUser.save();
        res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/refresh_token",
        });
        return { code: 200, success: true };
    }
};
__decorate([
    (0, type_graphql_1.Query)((_return) => [Users_1.Users]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Query)((returns) => GetUser_1.GetUser),
    __param(0, (0, type_graphql_1.Arg)("user_id", (_type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "get_user", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("userInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput_1.RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "create_user", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("loginInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("user_id", (_type) => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=User.js.map