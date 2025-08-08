import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import propertyRoutes from "./routes/property.route.js"
import categoryRoutes from "./routes/category.route.js"
import facilityRoutes from "./routes/facility.route.js"
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// CORS setup for React Native (Expo)
app.use(
  cors({
    origin: ['http://localhost:19006', 'http://192.168.0.104:5000'],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/facilities", facilityRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
