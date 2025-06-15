import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import employeeReportRoutes from "./routes/employerecordroute.js";
import resetPasswordRoutes from "./routes/resetPasswordRoutes.js";
import dashboardStatsRoutes from "./routes/employecountroute.js";
import employeeReportsRoutesUPload from "./routes/UploadCSVroute.js";
import authRoutes from "./routes/authroute.js";
const app = express();
dotenv.config();

// Connect to MongoDB
try {
  await mongoose.connect(
    "mongodb+srv://za5232208:za5232208@cluster0.20t93.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("Database Connection Successfully!!");
} catch (error) {
  console.error("Error connecting to MongoDB:", error.message);
  process.exit(1);
}
//Now let etest

// Set CORS options to allow the client URL
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://hacktaemployerecord.vercel.app",
    "https://employeerecord.hacktaconnect.com"
  ], // Allow your frontend origin
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests for all routes

app.use(express.json());
app.use(cookieParser());

// Define a simple route
app.get("/", (req, res) => {
  res.status(200).json("App Work 100% Hacta Employe Record");
});

// Start router from here
app.use("/api/employeereports", employeeReportRoutes);
app.use("/api/resetpassword", resetPasswordRoutes);
app.use("/api/employrecorcdcount", dashboardStatsRoutes);
app.use("/api/uploademployeereports", employeeReportsRoutesUPload);
app.use("/api/auth", authRoutes); // 👈 Add Auth Routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
