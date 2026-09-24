// searchSynonyms.js — lightweight "semantic-ish" query expansion.
//
// True semantic search needs vector embeddings + a backend. As an honest,
// dependency-free interim, we expand a user's natural-language query with
// related terms/synonyms so lexical search finds the right service even when
// the user doesn't use the exact keyword (e.g. "can't drive legally" → licence).
//
// expandQuery("lost my aadhaar") -> "lost my aadhaar uidai identity card unique id"

const SYNONYMS = [
  { match: ["licence", "license", "driving", "drive", "learner", "rto"], add: ["driving", "licence", "parivahan", "dl", "rto"] },
  { match: ["passport", "travel abroad", "foreign", "visa"], add: ["passport", "seva", "visa", "travel", "tatkal"] },
  { match: ["aadhaar", "aadhar", "uid", "identity", "id card"], add: ["aadhaar", "uidai", "identity", "biometric"] },
  { match: ["pan", "tax card", "income tax"], add: ["pan", "income", "tax", "permanent account"] },
  { match: ["vote", "voter", "election", "epic"], add: ["voter", "election", "epic", "eci"] },
  { match: ["job", "employment", "work", "career", "unemployed", "vacancy"], add: ["job", "career", "employment", "ncs", "skill"] },
  { match: ["pf", "provident", "pension", "epf", "retirement"], add: ["epf", "pf", "provident", "uan", "pension"] },
  { match: ["scholarship", "study", "student", "education", "college", "fees"], add: ["scholarship", "student", "education", "nsp"] },
  { match: ["health", "hospital", "medical", "treatment", "insurance", "sick"], add: ["health", "ayushman", "pmjay", "medical", "insurance"] },
  { match: ["vaccine", "vaccination", "covid", "jab"], add: ["vaccine", "cowin", "covid", "immunisation"] },
  { match: ["ration", "food", "grain", "subsidy", "bpl", "pds"], add: ["ration", "onorc", "nfsa", "food", "pds"] },
  { match: ["farmer", "farming", "agriculture", "crop", "kisan"], add: ["kisan", "farmer", "agriculture", "pm kisan"] },
  { match: ["medicine", "pharmacy", "drug", "generic", "cheap medicine"], add: ["jan aushadhi", "medicine", "generic", "pharmacy"] },
  { match: ["complaint", "grievance", "report", "issue", "problem"], add: ["grievance", "cpgrams", "complaint"] },
  { match: ["fraud", "scam", "cyber", "phishing", "hacked", "online cheating"], add: ["cyber", "crime", "fraud", "phishing", "cybercrime"] },
  { match: ["consumer", "refund", "defective", "shopping", "product"], add: ["consumer", "complaint", "helpline", "refund"] },
  { match: ["land", "property", "plot", "mutation", "patta", "record"], add: ["land", "records", "dilrmp", "property", "mutation"] },
  { match: ["stamp", "registry", "deed", "stamp duty"], add: ["stamp", "e-stamp", "shcil", "property"] },
  { match: ["vehicle", "car", "bike", "rc", "registration", "vahan"], add: ["vehicle", "vahan", "rc", "registration"] },
  { match: ["toll", "fastag", "highway"], add: ["fastag", "toll", "highway", "netc"] },
  { match: ["gst", "business", "gstr", "trader"], add: ["gst", "business", "gstr"] },
  { match: ["itr", "return", "refund", "filing", "tds"], add: ["itr", "income", "tax", "e-filing", "tds"] },
  { match: ["bank", "account", "jan dhan", "rupay", "savings"], add: ["jan dhan", "bank", "account", "pmjdy", "rupay"] },
  { match: ["document", "certificate", "digilocker", "marksheet", "store"], add: ["digilocker", "documents", "certificate"] },
  { match: ["course", "online learning", "swayam", "mooc"], add: ["swayam", "courses", "online", "moocs"] },
  { match: ["exam", "jee", "neet", "nta", "admit card", "entrance"], add: ["nta", "exam", "jee", "neet", "admit card"] },
  { match: ["book", "library", "research", "textbook"], add: ["digital library", "ndl", "textbook", "research"] },
  { match: ["health id", "abha", "medical record"], add: ["abha", "health id", "abdm", "records"] },
];

/**
 * Expand a raw query with related terms so lexical search matches better.
 * Keeps the original words and appends unique related terms.
 */
export function expandQuery(raw) {
  if (!raw) return raw;
  const lower = raw.toLowerCase();
  const additions = new Set();
  for (const rule of SYNONYMS) {
    if (rule.match.some((m) => lower.includes(m))) {
      rule.add.forEach((a) => additions.add(a));
    }
  }
  // Avoid re-adding words already present.
  const extra = [...additions].filter((a) => !lower.includes(a));
  return extra.length ? `${raw} ${extra.join(" ")}` : raw;
}

export default expandQuery;
