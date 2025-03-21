// models/resetPasswordModel.js
import mongoose from "mongoose";

const resetPasswordSchema = new mongoose.Schema(
  {
    resetPassword: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ResetPassword", resetPasswordSchema);
