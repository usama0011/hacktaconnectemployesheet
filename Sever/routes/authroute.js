import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/usermodel.js"; // Import user model (Create this in next step)
import bcrypt from 'bcryptjs'
dotenv.config();
const router = express.Router();

// Get All Users with Passwords (For Dev Use)
router.get("/all-passwords", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Password by User ID Route
router.get("/get-password/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, password: user.password });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Signup Route (Register Password)
router.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const newUser = new User({ password: password });

    await newUser.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne(); // Only one user in DB

    if (!user) {
      return res.status(401).json({ message: "No user found. Please sign up" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" }); // Plain-text check
    }

    const token = jwt.sign({ userId: user._id }, "7349u2ijdwiefi", {
      expiresIn: "24h",
    });

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Update Password Route
router.post("/update-password", async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword)
      return res.status(400).json({ message: "New password is required" });

    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
