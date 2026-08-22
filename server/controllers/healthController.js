import mongoose from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";

export const getHealthStatus = asyncHandler(async (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  res.status(200).json({
    success: true,
    message: "Government Services API is healthy",
    database: isDbConnected ? "connected" : "disconnected",
  });
});
