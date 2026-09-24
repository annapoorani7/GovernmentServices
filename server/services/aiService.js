import OpenAI from "openai";
import { callHuggingFace } from "../providers/huggingface.js";

// ============================================
// MODEL CONFIGURATION
// ============================================

const getOpenAIModel = () =>
  process.env.OPENAI_MODEL || "gpt-4o-mini";

const getHuggingFaceModel = () =>
  process.env.HF_MODEL || "openai/gpt-oss-120b:fastest";

const isDevelopment = () =>
  process.env.NODE_ENV !== "production";

// ============================================
// SERVICE HELPERS
// ============================================

// Convert database service data into safe public data
const toPublicService = (service, reason) => ({
  id: service._id?.toString() || service.id,
  name: service.name,
  description: service.description,
  category: service.category?.name || "Government service",
  officialLink: service.officialLink,
  reason:
    reason ||
    `${service.name} was retrieved from the verified service directory.`,
});

// Create verified context for AI providers
const serviceContext = (services = []) =>
  services.map((service) => ({
    id: service._id?.toString() || service.id,
    name: service.name,
    category: service.category?.name || "Government service",
    description: service.description,
    eligibility:
      service.eligibilitySummary || "Not available in the directory.",
    requiredDocuments: service.requiredDocuments || [],
    commonUseCases: service.commonUseCases || [],
    officialLink: service.officialLink,
    keywords: service.keywords || [],
  }));

// ============================================
// GROUNDED FALLBACK
// ============================================

const buildFallback = (message, services = [], history = []) => {
  if (!services.length) {
    return {
      answer:
        "I could not find a matching service in Sahaayak's verified directory. Please tell me which document, benefit, department, or government service you need help with.",
      recommendedServices: [],
      followUpSuggestions: [
        "Which government document or benefit is this about?",
        "Is this a new application, update, renewal, or complaint?",
      ],
      followUpQuestions: [
        "Which government document or benefit is this about?",
        "Is this a new application, update, renewal, or complaint?",
      ],
      actionPlan: [],
      grounded: true,
      provider: "retrieval-fallback",
    };
  }

  // Use only the best matching service
  const primary = services[0];

  const documents =
    primary.requiredDocuments?.slice(0, 5) || [];

  const hasHistory = history.some(
    (item) => item.role === "user"
  );

  const asksForDocuments =
    /\b(document|documents|requirement|requirements|papers)\b/i.test(
      message
    );

  const asksForBalance =
    /\b(balance|epf balance|pf balance|provident fund balance)\b/i.test(
      message
    );

  const asksForStatus =
    /\b(status|track|tracking|check)\b/i.test(message);

  let answer;

  // Document follow-up
  if (hasHistory && asksForDocuments) {
    answer = documents.length
      ? `For ${primary.name}, the verified service directory lists the following documents or requirements:\n\n${documents
          .map((document) => `• ${document}`)
          .join(
            "\n"
          )}\n\nPlease check the official portal for the latest exact requirements.`
      : `The verified service directory does not contain specific document requirements for ${primary.name}. Please check the official portal for the latest information.`;
  }

  // Balance query
  else if (asksForBalance) {
    answer = `${primary.name} is the closest verified service for your request.\n\n${primary.description}\n\nPlease use the official portal to check your current balance.`;
  }

  // Status or tracking follow-up
  else if (hasHistory && asksForStatus) {
    answer = `For ${primary.name}, the verified directory says:\n\n${primary.description}\n\nPlease check the official portal for the current status or tracking option.`;
  }

  // General answer
  else {
    const useCase =
      primary.commonUseCases?.[0] ||
      "complete the government service you described";

    answer = `${primary.name} is the closest verified service for your request. It can help you ${useCase.toLowerCase()}.\n\n${primary.description}\n\nPlease check the official portal for the latest information.`;
  }

  // IMPORTANT:
  // Return only the strongest matching service
  const recommendations = [
    toPublicService(primary),
  ];

  const suggestion =
    `Would you like help with documents, eligibility, application steps, renewal, or status for ${primary.name}?`;

  return {
    answer,
    recommendedServices: recommendations,
    followUpSuggestions: [suggestion],
    followUpQuestions: [suggestion],
    actionPlan: [],
    grounded: true,
    provider: "retrieval-fallback",
  };
};

// ============================================
// AI INSTRUCTIONS
// ============================================

const instructions = `
You are Sahaayak AI, a helpful conversational assistant for Indian government services.

Answer the user's actual question directly and naturally.

IMPORTANT GROUNDING RULES:

Use ONLY information explicitly provided in the verified service context.

Do NOT add information from your general knowledge.

Do NOT invent or assume:
- exact procedures or steps
- Aadhaar numbers, EID, OTP, login requirements, or account details
- fees
- deadlines
- eligibility rules
- required documents
- government policies
- replacement procedures
- URLs other than officialLink values in the verified context

If the verified service context does not contain enough information to answer the user's question, clearly say:

"The verified service directory does not contain enough details for this. Please check the official portal."

Use recent conversation context only for genuine follow-up questions such as:
- What documents do I need?
- How do I check it?
- What is the eligibility?
- How can I track it?

If the user's latest message clearly refers to a different government service, answer the new topic instead of continuing the previous topic.

When mentioning an official website, use only the officialLink provided in the verified service context.

Do not repeatedly use the same introduction.

Keep answers concise, helpful, and natural.

Use bullet points or numbered steps only when the verified context explicitly supports them.
`;

// ============================================
// OPENAI CONVERSATION INPUT
// ============================================

const buildOpenAIInput = (
  message,
  history = [],
  services = []
) => {
  const recentHistory = history
    .slice(-12)
    .map((item) => ({
      role: item.role,
      content: item.content,
    }));

  return [
    ...recentHistory,
    {
      role: "user",
      content: `${message}

Verified service context:
${JSON.stringify(serviceContext(services), null, 2)}`,
    },
  ];
};

// ============================================
// MAIN AI FUNCTION
// ============================================

export const assistWithServices = async (
  message,
  services = [],
  history = []
) => {
  const provider = (
    process.env.AI_PROVIDER ||
    (process.env.OPENAI_API_KEY ? "openai" : "fallback")
  ).toLowerCase();

  let model;
  let keyConfigured;

  // Provider configuration
  if (provider === "huggingface") {
    model = getHuggingFaceModel();
    keyConfigured = Boolean(process.env.HF_API_KEY);
  } else if (provider === "openai") {
    model = getOpenAIModel();
    keyConfigured = Boolean(process.env.OPENAI_API_KEY);
  } else {
    model = "none";
    keyConfigured = false;
  }

  // Development log
  if (isDevelopment()) {
    console.log(
      `[AI] provider=${provider} keyConfigured=${keyConfigured} model=${model}`
    );
  }

  // ============================================
  // HUGGING FACE PROVIDER
  // ============================================

  if (provider === "huggingface") {
    if (!process.env.HF_API_KEY) {
      console.error(
        "[AI] HF_API_KEY is missing. Using grounded fallback."
      );

      return buildFallback(
        message,
        services,
        history
      );
    }

    try {
      const result = await callHuggingFace(
        message,
        serviceContext(services)
      );

      if (isDevelopment()) {
        console.log(
          "[AI] Hugging Face response generated successfully"
        );
      }

      return {
        answer: result.answer,

        // Return ONLY the best matching service
        recommendedServices: services.length > 0
          ? [toPublicService(services[0])]
          : [],

        followUpSuggestions: [],
        followUpQuestions: [],
        actionPlan: [],
        grounded: true,
        provider: "huggingface",
      };
    } catch (error) {
      console.error(
        `[AI] Hugging Face unavailable, using grounded fallback: ${error.message}`
      );

      return buildFallback(
        message,
        services,
        history
      );
    }
  }

  // ============================================
  // OPENAI PROVIDER
  // ============================================

  if (provider === "openai") {
    if (!process.env.OPENAI_API_KEY) {
      console.error(
        "[AI] OPENAI_API_KEY is missing. Using grounded fallback."
      );

      return buildFallback(
        message,
        services,
        history
      );
    }

    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        timeout: 15000,
        maxRetries: 0,
      });

      const response =
        await client.responses.create({
          model: getOpenAIModel(),

          instructions: `${instructions}

Verified service context:
${JSON.stringify(
  serviceContext(services),
  null,
  2
)}`,

          input: buildOpenAIInput(
            message,
            history,
            services
          ),

          temperature: 0.2,
        });

      const answer =
        response.output_text?.trim();

      if (!answer) {
        throw new Error(
          "OpenAI returned an empty response"
        );
      }

      if (isDevelopment()) {
        console.log(
          "[AI] OpenAI response generated successfully"
        );
      }

      return {
        answer,

        // Return ONLY the best matching service
        recommendedServices: services.length > 0
          ? [toPublicService(services[0])]
          : [],

        followUpSuggestions: [],
        followUpQuestions: [],
        actionPlan: [],
        grounded: true,
        provider: "openai",
      };
    } catch (error) {
      console.error(
        `[AI] OpenAI unavailable, using grounded fallback: ${error.message}`
      );

      return buildFallback(
        message,
        services,
        history
      );
    }
  }

  // ============================================
  // FALLBACK / UNKNOWN PROVIDER
  // ============================================

  if (
    provider !== "fallback" &&
    isDevelopment()
  ) {
    console.warn(
      `[AI] Unknown provider "${provider}". Using grounded fallback.`
    );
  }

  return buildFallback(
    message,
    services,
    history
  );
};