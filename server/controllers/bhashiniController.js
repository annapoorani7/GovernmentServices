import asyncHandler from "../middleware/asyncHandler.js";
import { successResponse, errorResponse } from "../utils/apiResponse.js";
import {
  isBhashiniConfigured,
  translateText as translateWithBhashini,
} from "../scripts/i18n/bhashiniClient.js";

const LANGUAGE_PATTERN = /^[a-z]{2,5}$/;

export const getBhashiniStatus = asyncHandler(async (req, res) => {
  successResponse(res, {
    configured: isBhashiniConfigured(),
    sourceLanguage: "en",
  });
});

export const translate = asyncHandler(async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  const sourceLanguage = typeof req.body?.sourceLanguage === "string" ? req.body.sourceLanguage.trim().toLowerCase() : "";
  const targetLanguage = typeof req.body?.targetLanguage === "string" ? req.body.targetLanguage.trim().toLowerCase() : "";

  if (!text) {
    return errorResponse(res, "Text is required for translation.", 400);
  }

  if (text.length > 5000) {
    return errorResponse(res, "Text is too long to translate.", 400);
  }

  if (!sourceLanguage || !targetLanguage) {
    return errorResponse(res, "Both sourceLanguage and targetLanguage are required.", 400);
  }

  if (!LANGUAGE_PATTERN.test(sourceLanguage) || !LANGUAGE_PATTERN.test(targetLanguage)) {
    return errorResponse(res, "Language codes are invalid.", 400);
  }

  if (sourceLanguage === targetLanguage) {
    return successResponse(res, {
      translatedText: text,
      sourceLanguage,
      targetLanguage,
    });
  }

  if (!isBhashiniConfigured()) {
    return errorResponse(
      res,
      "Bhashini translation is not configured on this server. Please add BHASHINI_USER_ID, BHASHINI_API_KEY, and BHASHINI_PIPELINE_ID.",
      503
    );
  }

  try {
    const translatedText = await translateWithBhashini(text, sourceLanguage, targetLanguage);
    return successResponse(res, {
      translatedText,
      sourceLanguage,
      targetLanguage,
    });
  } catch (error) {
    return errorResponse(
      res,
      "Bhashini translation is temporarily unavailable. Please use English or try again later.",
      503
    );
  }
});
