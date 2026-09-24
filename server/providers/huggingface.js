import OpenAI from "openai";

export async function callHuggingFace(message, context = []) {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_API_KEY,
    timeout: 30000,
    maxRetries: 1,
  });

  const serviceInfo = context.map((service) => ({
    name: service.name,
    category: service.category,
    description: service.description,
    eligibility: service.eligibility,
    requiredDocuments: service.requiredDocuments,
    commonUseCases: service.commonUseCases,
    officialLink: service.officialLink,
  }));

  const instructions = `
You are Sahaayak AI, a helpful conversational assistant for Indian government services.

Answer the user's question naturally and directly using the verified service information provided below.

IMPORTANT RULES:

1. Base your answer primarily on the verified service context.

2. You may explain information that is directly supported by the service description and common use cases in simple, natural language.

3. Do not invent exact requirements that are not available in the verified context, including:
- fees
- deadlines
- eligibility rules
- required documents
- legal requirements

4. If the user asks about a specific action that is related to a service, and the service description supports that action, explain the available option.

For example, if the verified context says a service supports "download e-Aadhaar", you may tell the user that downloading e-Aadhaar is an available option.

5. If the exact details requested are missing, do NOT respond only with "not enough details".
First provide whatever useful information is available from the verified context, then say:
"For the exact current requirements or steps, please check the official portal."

6. When the user asks for documents:
- List requiredDocuments if they are available.
- If no documents are listed, clearly say that the verified directory does not list specific document requirements.

7. Use only the officialLink provided in the verified context when mentioning an official portal.

8. Do not make up URLs.

9. Keep answers concise and helpful.

VERIFIED SERVICE CONTEXT:
${JSON.stringify(serviceInfo, null, 2)}
`;

  const response = await client.chat.completions.create({
    model:
      process.env.HF_MODEL ||
      "openai/gpt-oss-120b:fastest",

    messages: [
      {
        role: "system",
        content: instructions,
      },
      {
        role: "user",
        content: message,
      },
    ],

    temperature: 0.2,
    max_tokens: 350,
  });

  const answer =
    response.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    throw new Error("Hugging Face returned an empty response");
  }

  return {
    provider: "huggingface",
    grounded: true,
    answer,
    recommendedServices: [],
  };
}