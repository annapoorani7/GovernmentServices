import mongoose from "mongoose";
import Category from "../models/Category.js";
import Service from "../models/Service.js";
import { sanitizeRegex } from "../utils/sanitizeRegex.js";

/**
 * Filter, search, and paginate government services
 */
export const getServices = async ({ category, search, page = 1, limit = 10 }) => {
  let filter = {};

  if (category) {
    if (mongoose.isValidObjectId(category)) {
      filter.category = category;
    } else {
      const foundCategory = await Category.findOne({
        name: { $regex: `^${sanitizeRegex(category)}$`, $options: "i" },
      });
      if (foundCategory) {
        filter.category = foundCategory._id;
      } else {
        filter.category = new mongoose.Types.ObjectId();
      }
    }
  }

  if (search && typeof search === "string" && search.trim()) {
    // Tokenise the query into individual words and match ANY of them across
    // fields. This makes multi-term queries (from the quiz / life-events /
    // synonym expansion) work correctly — each word can hit any service,
    // rather than requiring the whole phrase to appear literally.
    const tokens = search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((tok) => tok.length >= 2) // drop noise like single chars
      .slice(0, 25);                    // cap to keep the query bounded

    if (tokens.length > 0) {
      const searchableFields = [
        "name",
        "name_hi",
        "name_ta",
        "description",
        "keywords",
        "eligibilitySummary",
        "commonUseCases",
      ];

      // Build an $or of every token × every field.
      filter.$or = tokens.flatMap((tok) => {
        const rx = { $regex: sanitizeRegex(tok), $options: "i" };
        return searchableFields.map((field) => ({ [field]: rx }));
      });
    }
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  // Collect the search tokens once (for relevance ranking below).
  const searchTokens =
    search && typeof search === "string"
      ? search.trim().toLowerCase().split(/\s+/).filter((t) => t.length >= 2)
      : [];

  // When searching, rank by relevance (how many distinct tokens a service
  // matches) so different quiz / life-event answers surface different, most-
  // relevant services first — not just the first 8 in insertion order.
  if (searchTokens.length > 0) {
    const allMatches = await Service.find(filter).populate("category", "name");

    const scored = allMatches
      .map((svc) => {
        const haystack = [
          svc.name, svc.name_hi, svc.name_ta,
          svc.description,
          Array.isArray(svc.keywords) ? svc.keywords.join(" ") : "",
          svc.eligibilitySummary,
          Array.isArray(svc.commonUseCases) ? svc.commonUseCases.join(" ") : "",
        ].join(" ").toLowerCase();

        let score = 0;
        for (const tok of searchTokens) {
          if (!haystack.includes(tok)) continue;
          score += 1;
          // Weight name/keyword hits higher than description hits.
          const name = (svc.name || "").toLowerCase();
          const keywords = (Array.isArray(svc.keywords) ? svc.keywords.join(" ") : "").toLowerCase();
          if (name.includes(tok)) score += 3;
          if (keywords.includes(tok)) score += 2;
        }
        return { svc, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const total = scored.length;
    const totalPages = Math.ceil(total / limitNum) || 1;
    const pageItems = scored
      .slice((pageNum - 1) * limitNum, pageNum * limitNum)
      .map((x) => x.svc);

    return {
      services: pageItems,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
      },
    };
  }

  const total = await Service.countDocuments(filter);
  const totalPages = Math.ceil(total / limitNum) || 1;

  const services = await Service.find(filter)
    .populate("category", "name")
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  return {
    services,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPreviousPage: pageNum > 1,
    },
  };
};

/**
 * Get a single service by ID
 */
export const getServiceById = async (id) => {
  const service = await Service.findById(id).populate("category", "name");
  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }
  return service;
};

/**
 * Create a new service with allowed fields to prevent mass assignment
 */
export const createService = async (serviceData) => {
  const {
    name,
    description,
    officialLink,
    category,
    keywords,
    eligibilitySummary,
    requiredDocuments,
    commonUseCases,
  } = serviceData;
  const payload = {
    name,
    description,
    officialLink,
    category,
    keywords: Array.isArray(keywords) ? keywords : [],
    eligibilitySummary,
    requiredDocuments: Array.isArray(requiredDocuments) ? requiredDocuments : [],
    commonUseCases: Array.isArray(commonUseCases) ? commonUseCases : [],
  };
  return await Service.create(payload);
};

/**
 * Update an existing service by ID with allowed fields
 */
export const updateService = async (id, updateData) => {
  const allowedFields = [
    "name",
    "description",
    "officialLink",
    "category",
    "keywords",
    "eligibilitySummary",
    "requiredDocuments",
    "commonUseCases",
  ];
  const payload = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      payload[field] = updateData[field];
    }
  }

  const service = await Service.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("category", "name");

  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  return service;
};

/**
 * Delete a service by ID
 */
export const deleteService = async (id) => {
  const service = await Service.findById(id);
  if (!service) {
    const error = new Error("Service not found");
    error.statusCode = 404;
    throw error;
  }

  await Service.findByIdAndDelete(id);
  return true;
};
