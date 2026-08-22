import assert from "node:assert/strict";
import { assistWithServices } from "../services/aiService.js";

const service = ({ id, name, keywords, description, commonUseCases, requiredDocuments }) => ({
  _id: { toString: () => id },
  name,
  keywords,
  description,
  commonUseCases,
  requiredDocuments,
  officialLink: `https://${id}.gov.in/`,
  category: { name: "Test" },
});

const aadhaar = service({
  id: "aadhaar-id",
  name: "Aadhaar (UIDAI)",
  keywords: ["aadhaar", "uidai"],
  description: "Download e-Aadhaar and update identity details.",
  commonUseCases: ["Replace a lost identity document"],
  requiredDocuments: ["Identity proof", "Mobile number"],
});
const epfo = service({
  id: "epfo-id",
  name: "EPFO (Provident Fund)",
  keywords: ["epf", "epfo", "provident fund", "pf", "uan"],
  description: "Check PF balance and submit provident fund claims.",
  commonUseCases: ["Manage a provident fund account"],
  requiredDocuments: ["Identity proof", "UAN details"],
});
const passport = service({
  id: "passport-id",
  name: "Passport Seva",
  keywords: ["passport", "passport seva"],
  description: "Apply for a new passport or re-issue.",
  commonUseCases: ["Apply for or renew a passport"],
  requiredDocuments: ["Identity proof", "Address proof"],
});

const assertDocumentFollowUp = async (primary, firstMessage, followUp) => {
  const first = await assistWithServices(firstMessage, [primary]);
  const second = await assistWithServices(followUp, [primary], [
    { role: "user", content: firstMessage },
    { role: "assistant", content: `${first.answer}\nVerified services discussed: ${primary.name}` },
  ]);
  assert.match(second.answer, new RegExp(primary.name.split(" ")[0], "i"));
  assert.equal(second.recommendedServices[0].id, primary._id.toString());
};

await assertDocumentFollowUp(aadhaar, "I lost my Aadhaar card. What should I do?", "What documents do I need?");
await assertDocumentFollowUp(passport, "How can I renew my passport?", "What documents are required?");

const epfFirst = "I recently lost my job and need help with EPF.";
const epfFollowUp = await assistWithServices("How do I check my balance?", [epfo], [
  { role: "user", content: epfFirst },
  { role: "assistant", content: "We were discussing EPFO (Provident Fund)." },
]);
assert.match(epfFollowUp.answer, /EPFO|balance|status|PF/i);
assert.equal(epfFollowUp.recommendedServices[0].id, epfo._id.toString());

const ambiguous = await assistWithServices("I need help.", []);
assert.equal(ambiguous.recommendedServices.length, 0);
assert.ok(ambiguous.followUpSuggestions.length > 0);
console.log("PASS: contextual document, balance, passport, and ambiguity conversations");
