"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const crypto_1 = __importDefault(require("crypto"));
const router = express_1.default.Router();
router.post("/register", async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const user = new User_1.default({
            email,
            password,
            firstName,
            lastName,
            role: role && ["guest", "host"].includes(role) ? role : "guest",
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" });
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    }
    catch (error) {
        return res.status(400).json({ error: "Registration failed" });
    }
});
router.put("/update-role", auth_1.auth, async (req, res) => {
    try {
        const { role } = req.body;
        if (!role || !["guest", "host"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        const user = await User_1.default.findByIdAndUpdate(req.user._id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    }
    catch (error) {
        return res.status(400).json({ error: "Login failed" });
    }
});
router.get("/me", auth_1.auth, async (req, res) => {
    var _a;
    try {
        const user = await User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select("-password");
        res.json(user);
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: "If your email is registered, you will receive a password reset link" });
        }
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        return res.status(200).json({
            message: "If your email is registered, you will receive a password reset link",
            resetToken: resetToken
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
router.post("/change-password", auth_1.auth, async (req, res) => {
    var _a;
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: "Password has been changed successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
router.post("/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ error: "Password reset token is invalid or has expired" });
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return res.status(200).json({ message: "Password has been reset successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
router.get("/verify", auth_1.auth, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                phoneNumber: user.phoneNumber,
                avatar: user.avatar,
            }
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
router.put("/update-profile", auth_1.auth, async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, avatar } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.user._id, {
            firstName,
            lastName,
            phoneNumber,
            avatar
        }, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
router.post("/refresh-token", auth_1.auth, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                phoneNumber: user.phoneNumber,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map