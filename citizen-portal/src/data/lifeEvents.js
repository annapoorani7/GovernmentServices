// lifeEvents.js — "Life-event bundles" data model.
// Groups services by real-life moments rather than departments. Each bundle
// lists search tags that surface the relevant services via /services search.

export const LIFE_EVENTS = [
  {
    id: "newborn",
    icon: "👶",
    tKey: "life.newborn",
    tags: ["aadhaar", "health", "ayushman", "jan dhan", "abha"],
  },
  {
    id: "student",
    icon: "🎓",
    tKey: "life.student",
    tags: ["scholarship", "education", "swayam", "exam", "digilocker", "nta"],
  },
  {
    id: "job",
    icon: "💼",
    tKey: "life.job",
    tags: ["job", "epf", "esic", "pan", "career", "ncs"],
  },
  {
    id: "business",
    icon: "🏪",
    tKey: "life.business",
    tags: ["gst", "pan", "business", "udyam", "income tax"],
  },
  {
    id: "vehicle",
    icon: "🚗",
    tKey: "life.vehicle",
    tags: ["driving", "vehicle", "vahan", "fastag", "rc"],
  },
  {
    id: "travel",
    icon: "✈️",
    tKey: "life.travel",
    tags: ["passport", "visa", "oci", "travel"],
  },
  {
    id: "retirement",
    icon: "🧓",
    tKey: "life.retirement",
    tags: ["pension", "epf", "health", "ayushman"],
  },
  {
    id: "farmer",
    icon: "🌾",
    tKey: "life.farmer",
    tags: ["kisan", "farmer", "ration", "land", "jan dhan"],
  },
];
