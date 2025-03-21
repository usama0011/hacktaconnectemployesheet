import express from "express";
import EmployeeReport from "../models/registerEmploye.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const [morning, evening, night, officeAgent, wfhAgent, commercial, bahria] =
      await Promise.all([
        EmployeeReport.countDocuments({ shift: "Morning" }),
        EmployeeReport.countDocuments({ shift: "Evening" }),
        EmployeeReport.countDocuments({ shift: "Night" }),
        EmployeeReport.countDocuments({ branch: "Commercial" }),
        EmployeeReport.countDocuments({ branch: "Bahria" }),
        EmployeeReport.countDocuments({ designation: "Office Agent" }),
        EmployeeReport.countDocuments({ designation: "WFH Agent" }),
      ]);

    const result = [
      { title: "Morning Employees", count: morning },
      { title: "Evening Employees", count: evening },
      { title: "Night Employees", count: night },
      { title: "Office Agents", count: officeAgent },
      { title: "WFH Agents", count: wfhAgent },
      { title: "Commercial", count: commercial },
      { title: "Bahria", count: bahria },
    ];

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
