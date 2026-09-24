// languages.js — the 22 scheduled languages + English, with Bhashini ISO codes.
// `code` is what we use as the field suffix (name_<code>) and UI dict key.
// `bhashini` is the ISO code Bhashini expects (mostly identical).
// `nativeLabel` is what shows in the language dropdown.

export const LANGUAGES = [
  { code: "en", bhashini: "en", nativeLabel: "English",   label: "English" },
  { code: "hi", bhashini: "hi", nativeLabel: "हिन्दी",     label: "Hindi" },
  { code: "ta", bhashini: "ta", nativeLabel: "தமிழ்",      label: "Tamil" },
  { code: "bn", bhashini: "bn", nativeLabel: "বাংলা",      label: "Bengali" },
  { code: "te", bhashini: "te", nativeLabel: "తెలుగు",     label: "Telugu" },
  { code: "mr", bhashini: "mr", nativeLabel: "मराठी",      label: "Marathi" },
  { code: "gu", bhashini: "gu", nativeLabel: "ગુજરાતી",    label: "Gujarati" },
  { code: "kn", bhashini: "kn", nativeLabel: "ಕನ್ನಡ",      label: "Kannada" },
  { code: "ml", bhashini: "ml", nativeLabel: "മലയാളം",    label: "Malayalam" },
  { code: "pa", bhashini: "pa", nativeLabel: "ਪੰਜਾਬੀ",     label: "Punjabi" },
  { code: "or", bhashini: "or", nativeLabel: "ଓଡ଼ିଆ",      label: "Odia" },
  { code: "as", bhashini: "as", nativeLabel: "অসমীয়া",    label: "Assamese" },
  { code: "ur", bhashini: "ur", nativeLabel: "اردو",       label: "Urdu" },
  { code: "sa", bhashini: "sa", nativeLabel: "संस्कृतम्",   label: "Sanskrit" },
  { code: "ne", bhashini: "ne", nativeLabel: "नेपाली",     label: "Nepali" },
  { code: "kok", bhashini: "kok", nativeLabel: "कोंकणी",   label: "Konkani" },
  { code: "mai", bhashini: "mai", nativeLabel: "मैथिली",   label: "Maithili" },
  { code: "brx", bhashini: "brx", nativeLabel: "बड़ो",     label: "Bodo" },
  { code: "doi", bhashini: "doi", nativeLabel: "डोगरी",    label: "Dogri" },
  { code: "ks", bhashini: "ks", nativeLabel: "کٲشُر",      label: "Kashmiri" },
  { code: "mni", bhashini: "mni", nativeLabel: "ꯃꯤꯇꯩꯂꯣꯟ", label: "Manipuri" },
  { code: "sd", bhashini: "sd", nativeLabel: "سنڌي",       label: "Sindhi" },
  { code: "sat", bhashini: "sat", nativeLabel: "ᱥᱟᱱᱛᱟᱲᱤ",  label: "Santali" },
];

// Codes we already hand-translated and should NOT overwrite by default.
export const ALREADY_DONE = ["en", "hi", "ta"];

export const SOURCE_LANG = "en";
