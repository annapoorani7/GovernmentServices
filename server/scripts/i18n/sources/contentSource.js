// contentSource.js — extracts the English DB content (service names/descriptions
// + category guidance) that needs translating, and provides a rebuild() helper
// to reconstruct the same structure with translated strings.
//
// Rather than duplicating the seed data, we IMPORT the English source arrays
// from a shared module. To keep seed.js self-contained we mirror the English
// content here in the same shape the seed expects.
//
// The output structure written per language is:
//   {
//     services: { "<englishName>": { name, description } },
//     guidance: { "<Category>": { eligibilitySummary, requiredDocuments[], commonUseCases[] } }
//   }
// merge-translations.js maps these back onto seed.js by matching the English name/category.

import { ENGLISH_SERVICES, ENGLISH_GUIDANCE } from "./englishContent.js";

export function getEnglishContent() {
  // Collect every unique English string we need to translate (dedup to save calls).
  const uniqueSet = new Set();

  for (const svc of ENGLISH_SERVICES) {
    uniqueSet.add(svc.name);
    uniqueSet.add(svc.description);
  }
  for (const g of Object.values(ENGLISH_GUIDANCE)) {
    uniqueSet.add(g.eligibilitySummary);
    g.requiredDocuments.forEach((d) => uniqueSet.add(d));
    g.commonUseCases.forEach((c) => uniqueSet.add(c));
  }

  const uniqueStrings = [...uniqueSet];

  // rebuild(translate) -> structured translated content
  function rebuild(translate) {
    const services = {};
    for (const svc of ENGLISH_SERVICES) {
      services[svc.name] = {
        name: translate(svc.name),
        description: translate(svc.description),
      };
    }
    const guidance = {};
    for (const [cat, g] of Object.entries(ENGLISH_GUIDANCE)) {
      guidance[cat] = {
        eligibilitySummary: translate(g.eligibilitySummary),
        requiredDocuments: g.requiredDocuments.map(translate),
        commonUseCases: g.commonUseCases.map(translate),
      };
    }
    return { services, guidance };
  }

  return { uniqueStrings, rebuild };
}
