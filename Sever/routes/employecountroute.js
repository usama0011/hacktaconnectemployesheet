import express from "express";
import EmployeeReport from "../models/registerEmploye.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  try {
    const [
      morningOffice,
      morningWFH,
      eveningOffice,
      eveningWFH,
      nightOffice,
      nightWFH,
    ] = await Promise.all([
      EmployeeReport.countDocuments({
        shift: "Morning",
        designation: "Office Agent",
      }),
      EmployeeReport.countDocuments({
        shift: "Morning",
        designation: "WFH Agent",
      }),
      EmployeeReport.countDocuments({
        shift: "Evening",
        designation: "Office Agent",
      }),
      EmployeeReport.countDocuments({
        shift: "Evening",
        designation: "WFH Agent",
      }),
      EmployeeReport.countDocuments({
        shift: "Night",
        designation: "Office Agent",
      }),
      EmployeeReport.countDocuments({
        shift: "Night",
        designation: "WFH Agent",
      }),
    ]);

    const result = [
      { title: "Morning Office", count: morningOffice },
      { title: "Morning Work From Home", count: morningWFH },
      { title: "Evening Office", count: eveningOffice },
      { title: "Evening Work From Home", count: eveningWFH },
      { title: "Night Office", count: nightOffice },
      { title: "Night Work From Home", count: nightWFH },
    ];

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
