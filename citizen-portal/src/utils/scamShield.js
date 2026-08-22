// scamShield.js — client-side link safety checker.
//
// Uses the KNOWN OFFICIAL DOMAINS (drawn from the verified officialLink values
// in the service catalogue) as ground truth. Given a URL, it classifies it as:
//   • "verified"  — host is a known official government domain
//   • "gov"       — host ends in .gov.in / .nic.in (official pattern) but not
//                    in our explicit list (still likely genuine)
//   • "suspicious"— matches common scam red flags
//   • "unknown"   — not recognised; treat with caution
//
// This is a heuristic aid, NOT a guarantee — messaging always tells users to
// verify independently.

// Official domains present in the verified directory.
export const OFFICIAL_DOMAINS = [
  "uidai.gov.in",
  "incometax.gov.in",
  "voters.eci.gov.in",
  "passportindia.gov.in",
  "indianvisaonline.gov.in",
  "parivahan.gov.in",
  "vahan.parivahan.gov.in",
  "npci.org.in",
  "gst.gov.in",
  "tdscpc.gov.in",
  "pmjdy.gov.in",
  "dilrmp.gov.in",
  "shcilestamp.com",
  "epfindia.gov.in",
  "esic.gov.in",
  "ncs.gov.in",
  "cowin.gov.in",
  "pmjay.gov.in",
  "abdm.gov.in",
  "digilocker.gov.in",
  "scholarships.gov.in",
  "swayam.gov.in",
  "nta.ac.in",
  "ndl.iitkgp.ac.in",
  "nfsa.gov.in",
  "pmkisan.gov.in",
  "janaushadhi.gov.in",
  "pgportal.gov.in",
  "consumerhelpline.gov.in",
  "cybercrime.gov.in",
  "india.gov.in",
  "mygov.in",
];

// URL shorteners commonly used to disguise scam links.
const SHORTENERS = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "rb.gy", "cutt.ly", "is.gd", "ow.ly", "shorturl.at"];

// Lookalike / impersonation red-flag tokens: a host that *mentions* a gov brand
// but is NOT on a real gov domain is a classic phishing pattern.
const GOV_BRAND_TOKENS = ["aadhaar", "uidai", "pan", "passport", "epfo", "gst", "ayushman", "digilocker", "govt", "gov-", "-gov", "sarkar", "yojana"];

function normalizeHost(input) {
  try {
    let s = input.trim();
    if (!/^https?:\/\//i.test(s)) s = "https://" + s;
    const u = new URL(s);
    return u.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

function isOfficialPattern(host) {
  return /\.gov\.in$/.test(host) || /\.nic\.in$/.test(host) || host.endsWith(".ac.in");
}

/**
 * Check a URL/host string. Returns { status, host, reasons[] }.
 * status ∈ "verified" | "gov" | "suspicious" | "unknown" | "invalid"
 */
export function checkLink(input) {
  const host = normalizeHost(input);
  if (!host) return { status: "invalid", host: null, reasons: [] };

  const reasons = [];

  // 1. Exact match against known official domains (or subdomain of one).
  const official = OFFICIAL_DOMAINS.some((d) => host === d || host.endsWith("." + d));
  if (official) return { status: "verified", host, reasons: ["knownOfficial"] };

  // 2. Genuine official TLD pattern but not in our explicit list.
  const govPattern = isOfficialPattern(host);

  // 3. Red flags.
  const isShortener = SHORTENERS.includes(host);
  if (isShortener) reasons.push("shortener");

  const mentionsGovBrand = GOV_BRAND_TOKENS.some((tok) => host.includes(tok));
  if (mentionsGovBrand && !govPattern) reasons.push("impersonation");

  if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(host)) reasons.push("ipAddress");
  if (host.split(".").length > 4) reasons.push("manySubdomains");
  if (/(secure|verify|update|login|kyc|refund)[-.]/.test(host) && !govPattern) reasons.push("baitWord");

  if (reasons.length > 0) return { status: "suspicious", host, reasons };
  if (govPattern) return { status: "gov", host, reasons: ["govPattern"] };
  return { status: "unknown", host, reasons: [] };
}

// Short, translatable safety tips (keys resolved in the component).
export const SAFETY_TIP_KEYS = ["shield.tip1", "shield.tip2", "shield.tip3", "shield.tip4"];
