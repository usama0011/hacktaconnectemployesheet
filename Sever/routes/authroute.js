import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/usermodel.js"; // Import user model (Create this in next step)

dotenv.config();
const router = express.Router();

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

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne(); // Get the user from DB (Assuming only one user)
    if (!user) {
      return res.status(401).json({ message: "No user found. Please sign up" });
    }

    const token = jwt.sign({ userId: user._id }, "7349u2ijdwiefi", {
      expiresIn: "1h",
    });

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
