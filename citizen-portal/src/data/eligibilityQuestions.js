// eligibilityQuestions.js — data model for the Eligibility Quiz.
// Each question has options; each option carries `tags` (search terms) that
// map to relevant services, plus a translation key for its label.
// Results are computed by scoring services against accumulated tags via the
// existing /services search (no backend changes needed).
//
// Safety-first: results are ALWAYS framed as "you may be eligible — confirm
// on the official portal", never as a guarantee.

export const QUIZ = [
  {
    id: "age",
    tKey: "quiz.q.age",
    options: [
      { id: "under18", tKey: "quiz.a.under18", tags: ["scholarship", "student", "education", "aadhaar"] },
      { id: "18to60", tKey: "quiz.a.18to60", tags: ["job", "employment", "pan", "voter", "passport"] },
      { id: "over60", tKey: "quiz.a.over60", tags: ["pension", "epf", "health", "ayushman"] },
    ],
  },
  {
    id: "occupation",
    tKey: "quiz.q.occupation",
    options: [
      { id: "student", tKey: "quiz.a.student", tags: ["scholarship", "education", "swayam", "exam", "digilocker"] },
      { id: "salaried", tKey: "quiz.a.salaried", tags: ["epf", "income tax", "itr", "pan"] },
      { id: "business", tKey: "quiz.a.business", tags: ["gst", "business", "udyam", "pan"] },
      { id: "farmer", tKey: "quiz.a.farmer", tags: ["kisan", "farmer", "ration", "land"] },
      { id: "unemployed", tKey: "quiz.a.unemployed", tags: ["job", "career", "employment", "skill", "ncs"] },
    ],
  },
  {
    id: "income",
    tKey: "quiz.q.income",
    options: [
      { id: "low", tKey: "quiz.a.incomeLow", tags: ["ration", "ayushman", "welfare", "jan dhan", "scholarship"] },
      { id: "mid", tKey: "quiz.a.incomeMid", tags: ["income tax", "pan", "health"] },
      { id: "skip", tKey: "quiz.a.skip", tags: [] },
    ],
  },
  {
    id: "need",
    tKey: "quiz.q.need",
    options: [
      { id: "identity", tKey: "quiz.a.needIdentity", tags: ["aadhaar", "pan", "voter", "identity"] },
      { id: "health", tKey: "quiz.a.needHealth", tags: ["health", "ayushman", "abha", "cowin"] },
      { id: "money", tKey: "quiz.a.needMoney", tags: ["jan dhan", "kisan", "pension", "welfare"] },
      { id: "travel", tKey: "quiz.a.needTravel", tags: ["passport", "visa", "driving", "vehicle"] },
      { id: "grievance", tKey: "quiz.a.needGrievance", tags: ["grievance", "cyber", "consumer", "complaint"] },
    ],
  },
];

// Turn accumulated answer-tags into a single search string for /services.
export function tagsToQuery(selectedOptions) {
  const tags = new Set();
  selectedOptions.forEach((opt) => opt?.tags?.forEach((t) => tags.add(t)));
  return [...tags].join(" ");
}
