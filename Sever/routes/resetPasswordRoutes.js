import express from "express";
import ResetPassword from "../models/resetPasswordModel.js";

const router = express.Router();

// Create password
router.post("/", async (req, res) => {
  try {
    const { resetPassword } = req.body;
    const newPassword = new ResetPassword({ resetPassword });
    const saved = await newPassword.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all reset passwords
router.get("/", async (req, res) => {
  try {
    const passwords = await ResetPassword.find();
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a password
router.put("/:id", async (req, res) => {
  try {
    const updated = await ResetPassword.findByIdAndUpdate(
      req.params.id,
      { resetPassword: req.body.resetPassword },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Password not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a password
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ResetPassword.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Password not found" });
    }
    res.json({ message: "Password deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
