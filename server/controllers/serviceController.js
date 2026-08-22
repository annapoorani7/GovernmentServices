import asyncHandler from "../middleware/asyncHandler.js";
import * as serviceService from "../services/serviceService.js";

export const getServices = asyncHandler(async (req, res) => {
  const result = await serviceService.getServices(req.query);
  res.status(200).json({
    success: true,
    data: result.services,
    pagination: result.pagination,
  });
});

export const getServiceById = asyncHandler(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.id);
  res.status(200).json({
    success: true,
    data: service,
  });
});

export const addService = asyncHandler(async (req, res) => {
  const service = await serviceService.createService(req.body);
  res.status(201).json({
    success: true,
    message: "Service created successfully",
    data: service,
  });
});

export const updateService = asyncHandler(async (req, res) => {
  const service = await serviceService.updateService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Service updated successfully",
    data: service,
  });
});

export const deleteService = asyncHandler(async (req, res) => {
  await serviceService.deleteService(req.params.id);
  res.status(200).json({
    success: true,
    message: "Service deleted successfully",
  });
});
