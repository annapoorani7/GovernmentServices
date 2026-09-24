// generate-translations.js
// Auto-generates translations for every target language via Bhashini,
// for BOTH layers:
//   1. UI dictionary  (frontend translations.js keys)
//   2. DB content     (service names/descriptions + category guidance in seed.js)
//
// It writes OUTPUT to reviewable JSON files under scripts/i18n/output/<lang>/
// rather than mutating source directly — so a human can review before merge.
// A separate `merge` step (see merge-translations.js) folds approved JSON back
// into translations.js and seed.js.
//
// USAGE:
//   node scripts/i18n/generate-translations.js --langs=bn,te,mr
//   node scripts/i18n/generate-translations.js --all          (every pending lang)
//   node scripts/i18n/generate-translations.js --all --ui-only
//   node scripts/i18n/generate-translations.js --langs=bn --content-only
//
// Requires scripts/i18n/.env.bhashini with credentials (see .env.bhashini.example).

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { translateBatch } from "./bhashiniClient.js";
import { LANGUAGES, ALREADY_DONE, SOURCE_LANG } from "./languages.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "output");

// ── source data: English UI keys + English service content ──
// UI: we read the flat English dictionary straight from the frontend file
// by importing it. To keep this decoupled we re-declare the source-of-truth
// English strings here via a small extractor.
import { getEnglishUiDict } from "./sources/uiSource.js";
import { getEnglishContent } from "./sources/contentSource.js";

const BATCH_SIZE = 25; // Bhashini handles batches; keep modest to be safe.

function parseArgs() {
  const args = process.argv.slice(2);
  const langsArg = args.find((a) => a.startsWith("--langs="));
  const all = args.includes("--all");
  const uiOnly = args.includes("--ui-only");
  const contentOnly = args.includes("--content-only");

  let langs;
  if (all) {
    langs = LANGUAGES.map((l) => l.code).filter((c) => !ALREADY_DONE.includes(c));
  } else if (langsArg) {
    langs = langsArg.split("=")[1].split(",").map((s) => s.trim()).filter(Boolean);
  } else {
    console.error("Specify --langs=bn,te  or  --all");
    process.exit(1);
  }
  return { langs, uiOnly, contentOnly };
}

// chunk an array
const chunk = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

// Translate a flat { key: englishString } map → { key: translatedString }.
async function translateKeyedMap(map, targetLang) {
  const keys = Object.keys(map);
  const values = keys.map((k) => map[k]);
  const out = {};
  let done = 0;
  for (const batch of chunk(values, BATCH_SIZE)) {
    const translated = await translateBatch(batch, SOURCE_LANG, targetLang);
    batch.forEach((_, i) => {
      const globalIndex = done + i;
      out[keys[globalIndex]] = translated[i];
    });
    done += batch.length;
    process.stdout.write(`\r    UI: ${done}/${values.length}`);
  }
  process.stdout.write("\n");
  return out;
}

// Translate the service/category content arrays.
async function translateContent(content, targetLang) {
  // content.strings is a flat de-duplicated list; content.map tells us where
  // each translated string goes. We translate the unique list once.
  const uniques = content.uniqueStrings;
  const translatedUnique = [];
  let done = 0;
  for (const batch of chunk(uniques, BATCH_SIZE)) {
    const translated = await translateBatch(batch, SOURCE_LANG, targetLang);
    translatedUnique.push(...translated);
    done += batch.length;
    process.stdout.write(`\r    Content: ${done}/${uniques.length}`);
  }
  process.stdout.write("\n");

  const lookup = new Map(uniques.map((s, i) => [s, translatedUnique[i]]));
  // Rebuild the structured content with translated values.
  return content.rebuild((englishStr) => lookup.get(englishStr) ?? "");
}

async function main() {
  const { langs, uiOnly, contentOnly } = parseArgs();
  const uiDict = getEnglishUiDict();
  const content = getEnglishContent();

  console.log(`\n🌐 Generating translations for: ${langs.join(", ")}\n`);

  for (const lang of langs) {
    const meta = LANGUAGES.find((l) => l.code === lang);
    if (!meta) {
      console.warn(`  ⚠️  Unknown language code "${lang}" — skipping.`);
      continue;
    }
    console.log(`\n── ${meta.label} (${lang}) ──`);
    const langDir = path.join(OUTPUT_DIR, lang);
    await fs.mkdir(langDir, { recursive: true });

    if (!contentOnly) {
      const ui = await translateKeyedMap(uiDict, meta.bhashini);
      await fs.writeFile(path.join(langDir, "ui.json"), JSON.stringify(ui, null, 2));
      console.log(`  ✓ ui.json (${Object.keys(ui).length} keys)`);
    }

    if (!uiOnly) {
      const structured = await translateContent(content, meta.bhashini);
      await fs.writeFile(path.join(langDir, "content.json"), JSON.stringify(structured, null, 2));
      console.log(`  ✓ content.json`);
    }
  }

  console.log(`\n✅ Done. Review files under scripts/i18n/output/, then run merge-translations.js\n`);
}

main().catch((err) => {
  console.error("\n❌", err.message);
  process.exit(1);
});
