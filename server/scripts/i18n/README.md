# Bhashini Auto-Translation Pipeline

Auto-generates translations for all 22 scheduled Indian languages using
**Bhashini** (the Government of India's National Language Translation Mission),
for both layers of Sahaayak AI:

1. **UI dictionary** — the ~100 interface strings (`translations.js` keys)
2. **DB content** — 31 service names/descriptions + 10 category guidance blocks

## Why a review step?

This is a **government services app**: a mistranslated document requirement or
eligibility rule can misdirect a citizen. So the pipeline **never writes source
files or the DB directly from raw machine output**. It writes reviewable JSON
to `output/<lang>/`, and a separate merge step folds *approved* translations in.

```
English source ──▶ generate ──▶ output/<lang>/*.json ──▶ [HUMAN REVIEW] ──▶ merge ──▶ MongoDB
                   (Bhashini)                                                (idempotent)
```

## One-time setup

1. Register at https://bhashini.gov.in → subscribe to the **ULCA** APIs.
2. Copy your credentials:
   ```bash
   cp scripts/i18n/.env.bhashini.example scripts/i18n/.env.bhashini
   # then edit and fill in BHASHINI_USER_ID + BHASHINI_API_KEY
   ```
   (The script loads env via dotenv; you can also put these in server/.env.)

## Generate

```bash
# specific languages
node scripts/i18n/generate-translations.js --langs=bn,te,mr

# every pending language (all 22 minus en/hi/ta already done)
node scripts/i18n/generate-translations.js --all

# only one layer
node scripts/i18n/generate-translations.js --langs=bn --ui-only
node scripts/i18n/generate-translations.js --langs=bn --content-only
```

Output lands in `scripts/i18n/output/<lang>/ui.json` and `content.json`.

## Review

Open the JSON files. Have a native speaker sanity-check especially:
- Document/eligibility strings (safety-critical)
- Proper nouns / scheme names (Bhashini sometimes over-translates these)

## Merge approved translations into the DB

```bash
node scripts/i18n/merge-translations.js --langs=bn,te
```

⚠️ Before merging a new language, add its fields to `models/Service.js`
(Mongoose silently drops undefined-schema fields):
```js
name_bn: { type: String, trim: true },
description_bn: { type: String, trim: true },
eligibilitySummary_bn: { type: String, trim: true },
requiredDocuments_bn: [{ type: String, trim: true }],
commonUseCases_bn: [{ type: String, trim: true }],
```

## Wire up the frontend

For each new language, add one line to
`citizen-portal/src/i18n/translations.js` → `SUPPORTED_LANGUAGES`:
```js
{ code: "bn", label: "Bengali", nativeLabel: "বাংলা" },
```
…and paste the reviewed `ui.json` as a new block in the `translations` object.
The `localize()` helper + graceful fallback handle everything else — no
component changes needed.

## Files

| File | Purpose |
|------|---------|
| `bhashiniClient.js` | Two-step Bhashini API wrapper (config + translate), cached |
| `languages.js` | All 23 languages + Bhashini ISO codes |
| `sources/uiSource.js` | English UI strings (source of truth) |
| `sources/englishContent.js` | English service/guidance content |
| `sources/contentSource.js` | Dedups + rebuild helper |
| `generate-translations.js` | Main generator → writes output JSON |
| `merge-translations.js` | Folds approved JSON into MongoDB |

## Keeping in sync

`uiSource.js` and `englishContent.js` mirror the English strings in
`citizen-portal/src/i18n/translations.js` and `scripts/seed.js`. When you add a
new UI key or service, update the mirror too (or refactor both to import from
these shared modules — recommended long-term).
