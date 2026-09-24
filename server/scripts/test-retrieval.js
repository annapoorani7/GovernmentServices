import assert from "node:assert/strict";
import { scoreService, tokenize } from "../services/retrievalService.js";

const services = [
  {
    name: "Aadhaar (UIDAI)",
    keywords: ["aadhaar", "uidai", "identity"],
    description: "Download e-Aadhaar and update identity details.",
    commonUseCases: ["Replace a lost identity document"],
  },
  {
    name: "PAN Card (Income Tax)",
    keywords: ["pan", "income tax"],
    description: "Apply for and update PAN details.",
    commonUseCases: ["Update a tax identity document"],
  },
  {
    name: "EPFO (Provident Fund)",
    keywords: ["epf", "pf", "epfo", "provident fund", "uan"],
    description: "Check PF balance and submit provident fund claims.",
    commonUseCases: ["Manage a provident fund account"],
  },
  {
    name: "National Career Service",
    keywords: ["jobs", "career", "employment", "ncs", "jobseeker"],
    description: "Search jobs and access career support.",
    commonUseCases: ["Find jobs or training"],
  },
  {
    name: "Passport Seva",
    keywords: ["passport", "psk", "passport seva"],
    description: "Apply for a new passport or re-issue.",
    commonUseCases: ["Apply for or renew a passport"],
  },
  {
    name: "National Scholarship Portal",
    keywords: ["scholarship", "nsp", "student", "education"],
    description: "Apply for central and state scholarships.",
    commonUseCases: ["Apply for a scholarship"],
  },
  {
    name: "Cyber Crime Reporting",
    keywords: ["cyber", "fraud", "cybercrime"],
    description: "Report cybercrime incidents.",
    commonUseCases: ["Report an online fraud or consumer issue"],
  },
];

const cases = [
  ["I lost my Aadhaar card. What should I do?", "Aadhaar (UIDAI)", []],
  ["I recently lost my job and need help with my EPF.", "EPFO (Provident Fund)", ["National Career Service"]],
  ["How can I renew my passport?", "Passport Seva", []],
  ["I need a scholarship for my education.", "National Scholarship Portal", []],
  ["How do I file a cyber crime complaint?", "Cyber Crime Reporting", []],
];

for (const [query, expectedTop, expectedOther] of cases) {
  const tokens = tokenize(query);
  const ranked = services
    .map((service) => ({ service, score: scoreService(service, tokens).score }))
    .filter(({ score }) => score >= 15)
    .sort((a, b) => b.score - a.score);
  assert.equal(ranked[0]?.service.name, expectedTop, query);
  for (const expected of expectedOther) assert.ok(ranked.some(({ service }) => service.name === expected), expected);
  console.log(`PASS: ${query} -> ${ranked.map(({ service }) => service.name).join(", ")}`);
}

assert.equal(tokenize("I need help").length, 0);
console.log("PASS: I need help -> no meaningful retrieval tokens");