import { randomUUID } from "node:crypto";
import asyncHandler from "../middleware/asyncHandler.js";
import { retrieveRelevantServices } from "../services/retrievalService.js";
import { assistWithServices } from "../services/aiService.js";
import { appendConversation, getConversation } from "../services/conversationService.js";

export const assist = asyncHandler(async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) {
    const error = new Error("Please describe what you need help with.");
    error.statusCode = 400;
    throw error;
  }
  if (message.length > 1000) {
    const error = new Error("Please keep your request under 1000 characters.");
    error.statusCode = 400;
    throw error;
  }

  const suppliedSessionId = typeof req.body?.sessionId === "string" ? req.body.sessionId.trim() : "";
  if (suppliedSessionId && !/^[a-zA-Z0-9_-]{12,100}$/.test(suppliedSessionId)) {
    const error = new Error("A valid conversation session is required.");
    error.statusCode = 400;
    throw error;
  }
  const sessionId = suppliedSessionId || randomUUID();

const history = getConversation(sessionId);

// Detect when the user clearly starts talking about a different service.
const hasExplicitServiceTopic =
  /\b(aadhaar|uidai|epf|epfo|provident fund|passport|pan|income tax|scholarship|cyber crime|ration card|driving licence|voter id)\b/i.test(message);


const retrievalQuery = hasExplicitServiceTopic
  ? message
  : [
      ...history.slice(-6).map((item) => item.content),
      message,
    ].join(" ");

console.log(`[AI] Retrieval query mode: ${hasExplicitServiceTopic ? "new-topic" : "conversation-context"}`);

const services = await retrieveRelevantServices(retrievalQuery, 3);
  console.log(`[AI] Retrieved ${services.length} relevant services`);
  const result = await assistWithServices(message, services, history);
  appendConversation(sessionId, [
    { role: "user", content: message },
    {
      role: "assistant",
      content: `${result.answer}\nVerified services discussed: ${(result.recommendedServices || []).map((service) => service.name).join(", ")}`,
    },
  ]);
  res.status(200).json({ success: true, data: { ...result, sessionId } });
});