// merge-translations.js
// Folds reviewed translations from scripts/i18n/output/<lang>/ into MongoDB
// directly — updating each Service document's name_<lang>, description_<lang>,
// eligibilitySummary_<lang>, requiredDocuments_<lang>, commonUseCases_<lang>.
//
// This avoids regenerating seed.js and is safe to run repeatedly (idempotent).
// It matches services by their English `name` and categories by English name.
//
// USAGE:
//   node scripts/i18n/merge-translations.js --langs=bn,te
//   node scripts/i18n/merge-translations.js --all
//
// PRE-REQUISITE: add the new language fields to models/Service.js first (the
// script prints the exact schema lines you need if a write is silently dropped).

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import "dotenv/config";
import Category from "../../models/Category.js";
import Service from "../../models/Service.js";
import { LANGUAGES, ALREADY_DONE } from "./languages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "output");
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/govservices";

function parseArgs() {
  const args = process.argv.slice(2);
  const langsArg = args.find((a) => a.startsWith("--langs="));
  if (args.includes("--all")) {
    return LANGUAGES.map((l) => l.code).filter((c) => !ALREADY_DONE.includes(c));
  }
  if (langsArg) return langsArg.split("=")[1].split(",").map((s) => s.trim());
  console.error("Specify --langs=bn,te  or  --all");
  process.exit(1);
}

async function readJson(p) {
  try {
    return JSON.parse(await fs.readFile(p, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  const langs = parseArgs();
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Map category _id -> English name (guidance keyed by English category name)
  const categories = await Category.find({});
  const catNameById = new Map(categories.map((c) => [String(c._id), c.name]));

  for (const lang of langs) {
    const dir = path.join(OUTPUT_DIR, lang);
    const content = await readJson(path.join(dir, "content.json"));
    if (!content) {
      console.warn(`  ⚠️  No content.json for "${lang}" — skipping.`);
      continue;
    }
    console.log(`\n── Merging ${lang} ──`);

    let updated = 0;
    const services = await Service.find({});
    for (const svc of services) {
      const t = content.services[svc.name];
      const catName = catNameById.get(String(svc.category));
      const g = catName ? content.guidance[catName] : null;
      if (!t && !g) continue;

      if (t) {
        svc.set(`name_${lang}`, t.name);
        svc.set(`description_${lang}`, t.description);
      }
      if (g) {
        svc.set(`eligibilitySummary_${lang}`, g.eligibilitySummary);
        svc.set(`requiredDocuments_${lang}`, g.requiredDocuments);
        svc.set(`commonUseCases_${lang}`, g.commonUseCases);
      }
      await svc.save();
      updated += 1;
    }
    console.log(`  ✓ Updated ${updated} services with ${lang} content`);
    console.log(
      `  ℹ️  Ensure models/Service.js defines: name_${lang}, description_${lang}, ` +
        `eligibilitySummary_${lang}, requiredDocuments_${lang}, commonUseCases_${lang}`
    );
  }

  await mongoose.disconnect();
  console.log("\n✅ Merge complete.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌", err.message);
  process.exit(1);
});
