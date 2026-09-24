import Service from "../models/Service.js";

const STOP_WORDS = new Set([
  "i", "me", "my", "we", "you", "a", "an", "the", "and", "or", "to", "for",
  "of", "with", "what", "how", "can", "do", "does", "did", "need", "help",
  "want", "please", "recently", "currently", "should", "would", "could", "am",
  "is", "are", "was", "were", "be", "been", "this", "that", "it", "in", "on",
]);

const GENERIC_TERMS = new Set([
  "card", "document", "documents", "service", "services", "application", "apply",
  "get", "lost", "lose", "find", "information", "issue", "thing", "something",
]);
const ALIASES = {
  epf: ["epfo", "provident fund", "pf", "uan"],
  pf: ["epfo", "provident fund", "epf", "uan"],
  epfo: ["epf", "provident fund", "pf", "uan"],
  aadhaar: ["aadhar", "uidai"],
  aadhar: ["aadhaar", "uidai"],
  uidai: ["aadhaar", "aadhar"],
  passport: ["passport seva"],
  gst: ["goods and services tax"],
  pan: ["permanent account number", "income tax"],
  cybercrime: ["cyber crime", "cyber complaint"],
  "cyber crime": ["cybercrime", "cyber complaint"],
  job: ["employment", "national career service"],
  employment: ["job", "national career service"],
  scholarship: ["national scholarship portal"],
  ration: ["one nation one ration card", "onorc"],
};

const SEARCH_PHRASES = [
  ...Object.keys(ALIASES),
  ...Object.values(ALIASES).flat(),
].filter((phrase) => phrase.includes(" "));

const SCORE = {
  exactName: 100,
  namePhrase: 90,
  exactKeyword: 80,
  alias: 70,
  useCase: 40,
  eligibility: 30,
  description: 15,
  generic: 2,
};
const MIN_RELATIVE_SCORE = 0.45;
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalize = (value = "") => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const words = (value) => normalize(value).split(" ").filter(Boolean);
const includesTerm = (value, term) => new RegExp(`\\b${escapeRegex(term)}\\b`, "i").test(normalize(value));

export const tokenize = (message) =>
  [...new Set(words(message).filter((token) => token.length > 1 && !STOP_WORDS.has(token)))].slice(0, 16);

export const expandAliases = (tokens) => {
  const expanded = new Set(tokens);
  tokens.forEach((token) => (ALIASES[token] || []).forEach((alias) => expanded.add(alias)));
  return [...expanded];
};

const extractPhrases = (message) => {
  const normalized = normalize(message);
  return [...new Set(SEARCH_PHRASES.filter((phrase) => normalized.includes(phrase)))];
};
const searchableText = (service) =>
  [
    service.name,
  service.description,
  service.category?.name,
  ...(service.keywords || []),
    service.eligibilitySummary,
    ...(service.commonUseCases || []),
  ]
  .filter(Boolean)
  .join(" ");

const addReason = (reasons, amount, label) => {
  reasons.push({ amount, label });
  return amount;
};

export const scoreService = (service, tokens, phrases = []) => {
  const name = service.name || "";
  const keywordText = (service.keywords || []).join(" ");
  const useCaseText = (service.commonUseCases || []).join(" ");
  const eligibility = service.eligibilitySummary || "";
  const description = service.description || "";
  const expanded = expandAliases(tokens);
  const reasons = [];
  let score = 0;

  phrases.forEach((phrase) => {
    if (includesTerm(name, phrase)) score += addReason(reasons, SCORE.namePhrase, `phrase in service name: ${phrase}`);
    else if (includesTerm(keywordText, phrase)) score += addReason(reasons, SCORE.exactKeyword, `phrase in keywords: ${phrase}`);
    else if (includesTerm(useCaseText, phrase)) score += addReason(reasons, SCORE.useCase, `phrase in common use cases: ${phrase}`);
  });

  tokens.forEach((token) => {
    if (GENERIC_TERMS.has(token)) {
      if (includesTerm(searchableText(service), token)) {
        score += addReason(reasons, SCORE.generic, `generic match: ${token}`);
      }
      return;
    }

  const exactName = includesTerm(name, token);
  const exactKeyword = includesTerm(keywordText, token);
  if (exactName && normalize(name) === token) score += addReason(reasons, SCORE.exactName, `exact service name: ${token}`);
  else if (exactName) score += addReason(reasons, SCORE.namePhrase, `service name match: ${token}`);
  else if (exactKeyword) score += addReason(reasons, SCORE.exactKeyword, `exact keyword: ${token}`);
  else if (includesTerm(useCaseText, token)) score += addReason(reasons, SCORE.useCase, `common use case: ${token}`);
  else if (includesTerm(eligibility, token)) score += addReason(reasons, SCORE.eligibility, `eligibility match: ${token}`);
  else if (includesTerm(description, token)) score += addReason(reasons, SCORE.description, `description match: ${token}`);
  });

  expanded.filter((term) => !tokens.includes(term)).forEach((alias) => {
    if (includesTerm(name, alias)) score += addReason(reasons, SCORE.alias, `alias in service name: ${alias}`);
    else if (includesTerm(keywordText, alias)) score += addReason(reasons, SCORE.alias, `alias in keywords: ${alias}`);
    else if (includesTerm(useCaseText, alias)) score += addReason(reasons, SCORE.useCase, `alias in common use cases: ${alias}`);
    else if (includesTerm(description, alias)) score += addReason(reasons, SCORE.description, `alias in description: ${alias}`);
  });

  return { score, reasons };
};

const debugRanking = ({ message, tokens, expanded, phrases, ranked }) => {
  if (process.env.DEBUG_RETRIEVAL !== "true") return;
  console.log(`[RETRIEVAL] Query: ${message}`);
  console.log(`[RETRIEVAL] Tokens: ${tokens.join(", ") || "(none)"}`);
  console.log(`[RETRIEVAL] Expanded: ${expanded.join(", ") || "(none)"}`);
  console.log(`[RETRIEVAL] Phrases: ${phrases.join(", ") || "(none)"}`);
  ranked.forEach(({ service, score, reasons }) => {
    console.log(`[RETRIEVAL] ${service.name}: ${score} (${reasons.map(({ amount, label }) => `+${amount} ${label}`).join("; ")})`);
  });
  console.log(`[RETRIEVAL] Final: ${ranked.map(({ service }) => service.name).join(" > ") || "(none)"}`);
};

export const retrieveRelevantServices = async (message, limit = 5) => {
  const tokens = tokenize(message);
  const phrases = extractPhrases(message);
  const expanded = expandAliases(tokens);
  if (!tokens.length && !phrases.length) return [];

  const searchTerms = [...new Set([...tokens, ...expanded, ...phrases])];
  const expressions = searchTerms.map((term) => ({
    $or: [
      { name: { $regex: escapeRegex(term), $options: "i" } },
  { description: { $regex: escapeRegex(term), $options: "i" } },
  { keywords: { $regex: escapeRegex(term), $options: "i" } },
  { eligibilitySummary: { $regex: escapeRegex(term), $options: "i" } },
      { commonUseCases: { $regex: escapeRegex(term), $options: "i" } },
    ],
  }));
  const services = await Service.find({ $or: expressions })
    .populate("category", "name")
    .limit(100)
    .lean();
  const ranked = services
    .map((service) => ({ service, ...scoreService(service, tokens, phrases) }))
    .filter(({ score }) => score >= SCORE.description)
    .sort((a, b) => b.score - a.score || a.service.name.localeCompare(b.service.name));

  debugRanking({ message, tokens, expanded, phrases, ranked });
  const strongestScore = ranked[0]?.score || 0;
  const strongestCategory = ranked[0]?.service.category?.name;
  return ranked
    .filter(({ service, score }) => (
      score === strongestScore
      || score >= strongestScore * MIN_RELATIVE_SCORE
      || service.category?.name === strongestCategory
    ))
    .slice(0, limit)
    .map(({ service }) => service);
};
