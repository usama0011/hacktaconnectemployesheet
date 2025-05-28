// models/employeeReportModel.js
import mongoose from "mongoose";

const employeeReportSchema = new mongoose.Schema(
  {
    employeename: { type: String, required: true },
    shift: { type: String, required: true },
    designation: { type: String, required: true },
    picture: { type: String }, // Optional field (e.g., image URL or base64 string)
    CNIC: { type: String, required: true, unique: true }, // 🔒 Enforce unique CNIC
    branch: { type: String, required: true },
    mobileno: { type: String, required: true },
    status: {
      type: String,
      enum: ["Live", "Resigned", "Terminated"],
      default: "Live",
    }, // ✅ new field
  },
  { timestamps: true }
);

export default mongoose.model("EmployeeReport", employeeReportSchema);
