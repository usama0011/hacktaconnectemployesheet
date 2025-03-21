// models/employeeReportModel.js
import mongoose from "mongoose";

const employeeReportSchema = new mongoose.Schema(
  {
    employeename: { type: String, required: true },
    shift: { type: String, required: true },
    designation: { type: String, required: true },
    picture: { type: String }, // Optional field (e.g., image URL or base64 string)
    CNIC: { type: String, required: true },
    mobileno: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("EmployeeReport", employeeReportSchema);
