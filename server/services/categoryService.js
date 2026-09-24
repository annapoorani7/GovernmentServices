import Category from "../models/Category.js";
import Service from "../models/Service.js";

/**
 * Fetch all categories from database
 */
export const getAllCategories = async () => {
  return await Category.find();
};

/**
 * Create a new category with sanitized/allowed fields
 */
export const createCategory = async (categoryData) => {
  const { name, icon } = categoryData;
  const payload = { name };
  if (icon !== undefined) payload.icon = icon;
  return await Category.create(payload);
};

/**
 * Update an existing category by ID with allowed fields
 */
export const updateCategory = async (id, updateData) => {
  const { name, icon } = updateData;
  const payload = {};
  if (name !== undefined) payload.name = name;
  if (icon !== undefined) payload.icon = icon;

  const category = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

/**
 * Delete a category by ID after checking for associated services
 */
export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if services are referencing this category
  const serviceCount = await Service.countDocuments({ category: id });
  if (serviceCount > 0) {
    const error = new Error("Cannot delete category because services are associated with it");
    error.statusCode = 409;
    throw error;
  }

  await Category.findByIdAndDelete(id);
  return true;
};
