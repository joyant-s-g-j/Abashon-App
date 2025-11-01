import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./lib/db.js";
import { app, getActiveCallsCount, server } from "./lib/socket.js";
import authRoutes from "./routes/auth.route.js";
import callRoutes from "./routes/call.route.js";
import categoryRoutes from "./routes/category.route.js";
import facilityRoutes from "./routes/facility.route.js";
import messageRoutes from "./routes/message.route.js";
import paymentRoutes from "./routes/payment.route.js";
import propertyRoutes from "./routes/property.route.js";

dotenv.config();


const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// CORS setup for React Native (Expo) and APK
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from exp://, localhost, and all http/https origins for APK
      const allowedPatterns = [
        /^exp:\/\//,
        /^https:\/\//,
        /^http:\/\//,
        /^com\.abashon/  // Custom protocol for deep linking
      ];
      
      if (!origin || allowedPatterns.some(pattern => pattern.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/facilities", facilityRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/call", callRoutes)

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/call-stats", (req, res) => {
  res.json({
    activeCallsCount: getActiveCallsCount(),
    timestamp: new Date().toISOString()
  })
})

// Error handling middleware 
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
