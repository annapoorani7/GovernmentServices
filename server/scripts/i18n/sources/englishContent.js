// englishContent.js — the English source-of-truth for DB content.
// Mirror of the English fields in scripts/seed.js. Keep in sync when the
// catalogue changes. (Alternatively, refactor seed.js to import from here.)

export const ENGLISH_SERVICES = [
  { name: "Aadhaar (UIDAI)", description: "Apply for a new Aadhaar, update demographic/biometric details, download e-Aadhaar and check enrolment status." },
  { name: "PAN Card (Income Tax)", description: "Apply for a new PAN, correct existing PAN details, link PAN with Aadhaar and download e-PAN instantly." },
  { name: "Voter ID (Election Commission)", description: "Register as a new voter, apply for corrections, change address and download digital Voter ID (e-EPIC)." },
  { name: "Passport Seva", description: "Apply for a new passport, re-issue, tatkal service, police clearance certificate and track application status." },
  { name: "Visa & OCI Services", description: "Apply for Indian visa, e-Visa, OCI card, tourist visa extension and check application status online." },
  { name: "Driving Licence (Parivahan)", description: "Apply for learner's licence, permanent DL, renewal, duplicate DL and international driving permit." },
  { name: "Vehicle Registration (VAHAN)", description: "Register new vehicles, transfer ownership, apply for duplicate RC, hypothecation and check vehicle details." },
  { name: "FASTag", description: "Purchase, activate and recharge FASTag for cashless payment at national highway toll plazas across India." },
  { name: "Income Tax e-Filing", description: "File ITR online, e-verify returns, check refund status, view Form 26AS and manage tax deductions." },
  { name: "GST Portal", description: "GST registration, file GSTR returns, apply for refunds and track application status for businesses." },
  { name: "TRACES (TDS/TCS)", description: "Download Form 16/16A, view TDS certificates, correct TDS returns and reconcile tax deductions." },
  { name: "Pradhan Mantri Jan Dhan Yojana", description: "Open a bank account, get a RuPay card, set up mobile banking and access financial inclusion benefits under PMJDY." },
  { name: "Digital India Land Records (DILRMP)", description: "View state-wise digitised land records, mutation status, RoR (Record of Rights) and cadastral maps." },
  { name: "e-Stamping (SHCIL)", description: "Purchase non-judicial e-stamp papers online, verify authenticity and pay stamp duty for property deeds." },
  { name: "EPFO (Provident Fund)", description: "Check PF balance, download UAN passbook, transfer/withdraw PF, update KYC and file online claims." },
  { name: "ESIC (Employee State Insurance)", description: "ESI registration for employers, employee IP number issuance, medical benefits and dispensary services." },
  { name: "National Career Service", description: "Government job portal — search jobs, register as a jobseeker, career counselling and skill training." },
  { name: "CoWIN (Vaccination)", description: "Book vaccine slots, download COVID-19 vaccination certificate and view vaccination history." },
  { name: "Ayushman Bharat (PM-JAY)", description: "Check eligibility, apply for Ayushman card and access ₹5 lakh cashless health coverage for families." },
  { name: "ABHA (Health ID)", description: "Create your Ayushman Bharat Health Account, link medical records and access unified health data." },
  { name: "DigiLocker", description: "Store and share government-issued documents (marksheets, DL, RC, PAN) digitally with legal validity." },
  { name: "National Scholarship Portal", description: "Apply for central and state scholarships for students from minority, SC/ST/OBC and economically weaker sections." },
  { name: "SWAYAM (Online Courses)", description: "Free online courses from IITs, IIMs and central universities with UGC-recognised credit transfer." },
  { name: "National Testing Agency (NTA)", description: "Apply for JEE, NEET, UGC NET and other central exams, download admit cards and view result notifications." },
  { name: "National Digital Library of India", description: "Search, read and download millions of textbooks, research papers and academic resources from Indian institutions." },
  { name: "One Nation One Ration Card (ONORC)", description: "Portable ration card that lets beneficiaries buy subsidised food grains from any FPS across India." },
  { name: "PM Kisan Samman Nidhi", description: "Direct benefit transfer of ₹6,000/year to eligible farmer families in three instalments." },
  { name: "Jan Aushadhi", description: "Locate Pradhan Mantri Bhartiya Janaushadhi Kendras selling affordable generic medicines nationwide." },
  { name: "CPGRAMS", description: "Centralised Public Grievance Redress and Monitoring System — lodge and track complaints with any central ministry." },
  { name: "Consumer Helpline", description: "National Consumer Helpline — file complaints against unfair trade practices and defective goods/services." },
  { name: "Cyber Crime Reporting", description: "Report cybercrime incidents including online fraud, phishing and financial cyber crimes." },
];

export const ENGLISH_GUIDANCE = {
  Identity: {
    eligibilitySummary: "Eligibility depends on the identity document or update requested; check the official portal for current rules.",
    requiredDocuments: ["Proof of identity", "Proof of address", "Mobile number linked to the application"],
    commonUseCases: ["Apply for an identity document", "Correct personal details", "Download or track an identity document"],
  },
  Travel: {
    eligibilitySummary: "Eligibility depends on citizenship, travel purpose, and the specific travel document requested.",
    requiredDocuments: ["Identity proof", "Address proof", "Recent photograph or application reference, where requested"],
    commonUseCases: ["Apply for a passport or visa", "Renew a travel document", "Track a travel application"],
  },
  Transport: {
    eligibilitySummary: "Eligibility depends on age, vehicle or licence status, and the transaction being requested.",
    requiredDocuments: ["Identity proof", "Address proof", "Existing licence, registration, or vehicle details where applicable"],
    commonUseCases: ["Apply for or renew a licence", "Register or transfer a vehicle", "Check a transport transaction"],
  },
  Finance: {
    eligibilitySummary: "Eligibility depends on the taxpayer, business, account, or financial benefit involved.",
    requiredDocuments: ["PAN or other identity proof", "Bank account details", "Relevant financial or business records"],
    commonUseCases: ["File or track a financial transaction", "Register for a financial service", "Check a tax or benefit status"],
  },
  "Land & Property": {
    eligibilitySummary: "Eligibility and documents vary by state, property record, and transaction type.",
    requiredDocuments: ["Identity proof", "Property or land records", "Transaction details or deed information"],
    commonUseCases: ["Find land records", "Check mutation or ownership details", "Pay or verify property-related stamp duty"],
  },
  Employment: {
    eligibilitySummary: "Eligibility depends on employment status, account history, employer details, or job seeker profile.",
    requiredDocuments: ["Identity proof", "Employment or UAN details", "Bank details where a claim or benefit is involved"],
    commonUseCases: ["Check employment benefits", "Submit or track a PF or insurance request", "Find jobs or training"],
  },
  Health: {
    eligibilitySummary: "Eligibility depends on the health service, beneficiary details, and current programme rules.",
    requiredDocuments: ["Identity proof", "Mobile number", "Health or beneficiary details where applicable"],
    commonUseCases: ["Book or download a health record", "Check health scheme eligibility", "Create or manage a health ID"],
  },
  Education: {
    eligibilitySummary: "Eligibility depends on the course, exam, scholarship, or student category selected.",
    requiredDocuments: ["Student identity details", "Academic records", "Income or category certificate where applicable"],
    commonUseCases: ["Apply for a scholarship or exam", "Access learning resources", "Store or share an education document"],
  },
  "Ration & Welfare": {
    eligibilitySummary: "Eligibility depends on household, farmer, beneficiary, or welfare programme criteria.",
    requiredDocuments: ["Identity proof", "Household or beneficiary details", "Bank details where direct transfer applies"],
    commonUseCases: ["Check a welfare benefit", "Find or update ration information", "Locate an affordable public service"],
  },
  Grievance: {
    eligibilitySummary: "Anyone with a relevant complaint or report can review the official portal's submission requirements.",
    requiredDocuments: ["Contact details", "Complaint or incident description", "Supporting reference or evidence where available"],
    commonUseCases: ["Lodge a complaint", "Track a grievance", "Report an online fraud or consumer issue"],
  },
};
