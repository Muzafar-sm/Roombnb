"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
        if (!token) {
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        const user = await User_1.default.findOne({ _id: decoded._id });
        if (!user) {
            throw new Error();
        }
        req.user = {
            _id: user._id.toString(),
            role: user.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({ error: "Please authenticate." });
    }
};
exports.auth = auth;
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Please authenticate." });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied." });
        }
        return next();
    };
};
exports.checkRole = checkRole;
//# sourceMappingURL=auth.js.map