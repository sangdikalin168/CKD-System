"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = (type, user) => (0, jsonwebtoken_1.sign)(Object.assign({ user_id: user.user_id }, (type === "refreshToken" ? { tokenVersion: user.tokenVersion } : {})), type === "accessToken"
    ? process.env.ACCESS_TOKEN_SECRET
    : process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: type === "accessToken" ? "360d" : "360d",
});
exports.createToken = createToken;
const sendRefreshToken = (res, user) => {
    console.log("sendRefreshToken");
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, (0, exports.createToken)("refreshToken", user), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/refresh_token",
        expires: new Date(Date.now() + 1440 * 60 * 1000),
    });
};
exports.sendRefreshToken = sendRefreshToken;
//# sourceMappingURL=auth.js.map