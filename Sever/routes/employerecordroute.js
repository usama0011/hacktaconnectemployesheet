// routes/employeeReportRoutes.js
import express from "express";
import EmployeeReport from "../models/registerEmploye.js";
import multer from "multer";

const upload = multer(); // memory storage

const router = express.Router();

// Create
router.post("/", upload.none(), async (req, res) => {
  try {
    const newReport = new EmployeeReport(req.body); // ✅ Now this will work
    const saved = await newReport.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Read All
router.get("/", async (req, res) => {
  try {
    const reports = await EmployeeReport.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read One
router.get("/:id", async (req, res) => {
  try {
    const report = await EmployeeReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const updated = await EmployeeReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await EmployeeReport.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
