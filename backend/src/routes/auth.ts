import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { auth } from "../middleware/auth";
import crypto from "crypto";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user with role if provided (otherwise defaults to "guest")
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role && ["guest", "host"].includes(role) ? role : "guest", // Validate role
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
});

// Add a new route to update user role
router.put("/update-role", auth, async (req: any, res) => {
  try {
    const { role } = req.body;
    
    // Validate role
    if (!role || !["guest", "host"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }
    
    // Update user role
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role },
      { new: true }
    );
    
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
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

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
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Forgot Password - Request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return res.status(200).json({ message: "If your email is registered, you will receive a password reset link" });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiry on user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await user.save();
    
    // In a real application, you would send an email with the reset link
    // For this example, we'll just return the token in the response
    // In production, you should use a proper email service
    
    res.status(200).json({ 
      message: "If your email is registered, you will receive a password reset link",
      // Remove this in production, only for testing
      resetToken: resetToken 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Change Password - For authenticated users
router.post("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user by ID (from auth middleware)
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    
    // Set the new password
    user.password = newPassword;
    
    await user.save();
    
    res.status(200).json({ message: "Password has been changed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
// Reset Password - Process the reset
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // Find user with the given reset token and valid expiry
    const user = await User.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: "Password reset token is invalid or has expired" });
    }
    
    // Set the new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add this route before the export default router line

// Verify token and return user data
router.get("/verify", auth, async (req: any, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    
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
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update Profile
router.put("/update-profile", auth, async (req: any, res) => {
  try {
    const { firstName, lastName, phoneNumber, avatar } = req.body;
    
    // Find and update the user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        firstName, 
        lastName, 
        phoneNumber, 
        avatar 
      },
      { new: true }
    ).select("-password");
    
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
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Refresh token after role change
router.post("/refresh-token", auth, async (req: any, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Generate a fresh token with updated user info
    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );
    
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
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;