// routes/employeereportsRoutes.js (or wherever your employee routes are defined)
import express from "express";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import EmployeeReport from "../models/registerEmploye.js";

const router = express.Router();

// Multer config to read file buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload CSV route for employee records
router.post(
  "/upload-employee-records",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const results = [];
      const fileBuffer = req.file.buffer.toString("utf8");
      const readableStream = Readable.from(fileBuffer.split("\n"));

      await new Promise((resolve, reject) => {
        readableStream
          .pipe(csv())
          .on("data", (data) => {
            if (
              data.employeename &&
              data.CNIC &&
              data.mobileno &&
              data.shift &&
              data.branch &&
              data.designation
            ) {
              results.push({
                employeename: data.employeename,
                CNIC: data.CNIC,
                mobileno: data.mobileno,
                shift: data.shift,
                branch: data.branch,
                designation: data.designation,
              });
            }
          })
          .on("end", resolve)
          .on("error", reject);
      });

      if (results.length > 0) {
        await EmployeeReport.insertMany(results);
        res.status(200).json({
          success: true,
          message: "Employee records uploaded successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "No valid employee records found.",
        });
      }
    } catch (error) {
      console.error("CSV Upload Error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading employee records",
        error: error.message,
      });
    }
  }
);

export default router;
