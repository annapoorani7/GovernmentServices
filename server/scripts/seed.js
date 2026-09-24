// Seed script — populates MongoDB with real Indian Government services.
// Run: `node seed.js` from inside the /server folder.
// Requires .env with MONGO_URI.
// Includes English + Hindi (_hi) content for full localization.

import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import Service from "../models/Service.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/govservices";

const data = {
  Identity: [
    {
      name: "Aadhaar (UIDAI)",
      name_hi: "आधार (UIDAI)",
      name_ta: "ஆதார் (UIDAI)",
      description:
        "Apply for a new Aadhaar, update demographic/biometric details, download e-Aadhaar and check enrolment status.",
      description_hi:
        "नया आधार बनवाएँ, जनसांख्यिकीय/बायोमेट्रिक विवरण अपडेट करें, ई-आधार डाउनलोड करें और नामांकन स्थिति जाँचें।",
      description_ta:
        "புதிய ஆதாருக்கு விண்ணப்பிக்கவும், மக்கள்தொகை/பயோமெட்ரிக் விவரங்களைப் புதுப்பிக்கவும், இ-ஆதாரைப் பதிவிறக்கவும், பதிவு நிலையைச் சரிபார்க்கவும்.",
      officialLink: "https://uidai.gov.in/",
      keywords: ["aadhaar", "uid", "uidai", "identity", "biometric", "e-aadhaar"],
    },
    {
      name: "PAN Card (Income Tax)",
      name_hi: "पैन कार्ड (आयकर)",
      name_ta: "பான் அட்டை (வருமான வரி)",
      description:
        "Apply for a new PAN, correct existing PAN details, link PAN with Aadhaar and download e-PAN instantly.",
      description_hi:
        "नया पैन बनवाएँ, मौजूदा पैन विवरण सुधारें, पैन को आधार से जोड़ें और तुरंत ई-पैन डाउनलोड करें।",
      description_ta:
        "புதிய பானுக்கு விண்ணப்பிக்கவும், தற்போதைய பான் விவரங்களைத் திருத்தவும், பானை ஆதாருடன் இணைக்கவும், உடனடியாக இ-பானைப் பதிவிறக்கவும்.",
      officialLink: "https://www.incometax.gov.in/iec/foportal/",
      keywords: ["pan", "permanent account number", "tax", "income tax", "e-pan"],
    },
    {
      name: "Voter ID (Election Commission)",
      name_hi: "मतदाता पहचान पत्र (चुनाव आयोग)",
      name_ta: "வாக்காளர் அடையாள அட்டை (தேர்தல் ஆணையம்)",
      description:
        "Register as a new voter, apply for corrections, change address and download digital Voter ID (e-EPIC).",
      description_hi:
        "नए मतदाता के रूप में पंजीकरण करें, सुधार के लिए आवेदन करें, पता बदलें और डिजिटल मतदाता पहचान पत्र (e-EPIC) डाउनलोड करें।",
      description_ta:
        "புதிய வாக்காளராகப் பதிவு செய்யவும், திருத்தங்களுக்கு விண்ணப்பிக்கவும், முகவரியை மாற்றவும், டிஜிட்டல் வாக்காளர் அடையாள அட்டையை (e-EPIC) பதிவிறக்கவும்.",
      officialLink: "https://voters.eci.gov.in/",
      keywords: ["voter", "voter id", "election", "epic", "eci", "electoral"],
    },
  ],
  Travel: [
    {
      name: "Passport Seva",
      name_hi: "पासपोर्ट सेवा",
      name_ta: "பாஸ்போர்ட் சேவை",
      description:
        "Apply for a new passport, re-issue, tatkal service, police clearance certificate and track application status.",
      description_hi:
        "नया पासपोर्ट, पुनः जारी, तत्काल सेवा, पुलिस मंजूरी प्रमाणपत्र के लिए आवेदन करें और आवेदन की स्थिति ट्रैक करें।",
      description_ta:
        "புதிய பாஸ்போர்ட், மறு-வழங்கல், தத்கால் சேவை, காவல்துறை அனுமதிச் சான்றிதழுக்கு விண்ணப்பிக்கவும், விண்ணப்ப நிலையைக் கண்காணிக்கவும்.",
      officialLink: "https://www.passportindia.gov.in/",
      keywords: ["passport", "psk", "tatkal", "travel", "pcc", "passport seva"],
    },
    {
      name: "Visa & OCI Services",
      name_hi: "वीज़ा और OCI सेवाएँ",
      name_ta: "விசா & OCI சேவைகள்",
      description:
        "Apply for Indian visa, e-Visa, OCI card, tourist visa extension and check application status online.",
      description_hi:
        "भारतीय वीज़ा, ई-वीज़ा, OCI कार्ड, पर्यटक वीज़ा विस्तार के लिए आवेदन करें और ऑनलाइन आवेदन स्थिति जाँचें।",
      description_ta:
        "இந்திய விசா, இ-விசா, OCI அட்டை, சுற்றுலா விசா நீட்டிப்புக்கு விண்ணப்பிக்கவும், ஆன்லைனில் விண்ணப்ப நிலையைச் சரிபார்க்கவும்.",
      officialLink: "https://indianvisaonline.gov.in/",
      keywords: ["visa", "e-visa", "oci", "tourist", "immigration"],
    },
  ],
  Transport: [
    {
      name: "Driving Licence (Parivahan)",
      name_hi: "ड्राइविंग लाइसेंस (परिवहन)",
      name_ta: "ஓட்டுநர் உரிமம் (பரிவாகன்)",
      description:
        "Apply for learner's licence, permanent DL, renewal, duplicate DL and international driving permit.",
      description_hi:
        "लर्नर लाइसेंस, स्थायी ड्राइविंग लाइसेंस, नवीनीकरण, डुप्लिकेट लाइसेंस और अंतरराष्ट्रीय ड्राइविंग परमिट के लिए आवेदन करें।",
      description_ta:
        "கற்றுநர் உரிமம், நிரந்தர ஓட்டுநர் உரிமம், புதுப்பித்தல், நகல் உரிமம் மற்றும் சர்வதேச ஓட்டுநர் அனுமதிக்கு விண்ணப்பிக்கவும்.",
      officialLink: "https://parivahan.gov.in/parivahan/",
      keywords: ["driving licence", "dl", "learners", "rto", "parivahan", "idp"],
    },
    {
      name: "Vehicle Registration (VAHAN)",
      name_hi: "वाहन पंजीकरण (VAHAN)",
      name_ta: "வாகனப் பதிவு (VAHAN)",
      description:
        "Register new vehicles, transfer ownership, apply for duplicate RC, hypothecation and check vehicle details.",
      description_hi:
        "नए वाहन पंजीकृत करें, स्वामित्व स्थानांतरित करें, डुप्लिकेट RC, हाइपोथिकेशन के लिए आवेदन करें और वाहन विवरण जाँचें।",
      description_ta:
        "புதிய வாகனங்களைப் பதிவு செய்யவும், உரிமையை மாற்றவும், நகல் RC, அடமானத்திற்கு விண்ணப்பிக்கவும், வாகன விவரங்களைச் சரிபார்க்கவும்.",
      officialLink: "https://vahan.parivahan.gov.in/vahanservice/",
      keywords: ["vahan", "rc", "registration certificate", "vehicle", "rto"],
    },
    {
      name: "FASTag",
      name_hi: "फास्टैग",
      name_ta: "பாஸ்டேக்",
      description:
        "Purchase, activate and recharge FASTag for cashless payment at national highway toll plazas across India.",
      description_hi:
        "पूरे भारत में राष्ट्रीय राजमार्ग टोल प्लाज़ा पर कैशलेस भुगतान के लिए फास्टैग खरीदें, सक्रिय करें और रिचार्ज करें।",
      description_ta:
        "இந்தியா முழுவதும் தேசிய நெடுஞ்சாலை சுங்கச் சாவடிகளில் பணமில்லா பணம் செலுத்த பாஸ்டேக்கை வாங்கவும், செயல்படுத்தவும், ரீசார்ஜ் செய்யவும்.",
      officialLink: "https://www.npci.org.in/what-we-do/netc-fastag/product-overview",
      keywords: ["fastag", "toll", "highway", "netc", "npci"],
    },
  ],
  Finance: [
    {
      name: "Income Tax e-Filing",
      name_hi: "आयकर ई-फाइलिंग",
      name_ta: "வருமான வரி இ-தாக்கல்",
      description:
        "File ITR online, e-verify returns, check refund status, view Form 26AS and manage tax deductions.",
      description_hi:
        "ऑनलाइन ITR दाखिल करें, रिटर्न ई-सत्यापित करें, रिफंड स्थिति जाँचें, फॉर्म 26AS देखें और कर कटौती प्रबंधित करें।",
      description_ta:
        "ஆன்லைனில் ITR தாக்கல் செய்யவும், வருமானங்களை இ-சரிபார்க்கவும், பணத்திரும்ப நிலையைச் சரிபார்க்கவும், படிவம் 26AS-ஐப் பார்க்கவும், வரிக் கழிவுகளை நிர்வகிக்கவும்.",
      officialLink: "https://www.incometax.gov.in/iec/foportal/",
      keywords: ["itr", "income tax", "e-filing", "refund", "26as", "tds"],
    },
    {
      name: "GST Portal",
      name_hi: "जीएसटी पोर्टल",
      name_ta: "ஜிஎஸ்டி போர்ட்டல்",
      description:
        "GST registration, file GSTR returns, apply for refunds and track application status for businesses.",
      description_hi:
        "व्यवसायों के लिए जीएसटी पंजीकरण, GSTR रिटर्न दाखिल करें, रिफंड के लिए आवेदन करें और आवेदन स्थिति ट्रैक करें।",
      description_ta:
        "வணிகங்களுக்கான ஜிஎஸ்டி பதிவு, GSTR வருமானங்களைத் தாக்கல் செய்யவும், பணத்திரும்பத்திற்கு விண்ணப்பிக்கவும், விண்ணப்ப நிலையைக் கண்காணிக்கவும்.",
      officialLink: "https://www.gst.gov.in/",
      keywords: ["gst", "gstr", "gstin", "goods and services tax", "business"],
    },
    {
      name: "TRACES (TDS/TCS)",
      name_hi: "TRACES (टीडीएस/टीसीएस)",
      name_ta: "TRACES (டிடிஎஸ்/டிசிஎஸ்)",
      description:
        "Download Form 16/16A, view TDS certificates, correct TDS returns and reconcile tax deductions.",
      description_hi:
        "फॉर्म 16/16A डाउनलोड करें, टीडीएस प्रमाणपत्र देखें, टीडीएस रिटर्न सुधारें और कर कटौती का मिलान करें।",
      description_ta:
        "படிவம் 16/16A-ஐப் பதிவிறக்கவும், டிடிஎஸ் சான்றிதழ்களைப் பார்க்கவும், டிடிஎஸ் வருமானங்களைத் திருத்தவும், வரிக் கழிவுகளை ஒப்பிடவும்.",
      officialLink: "https://www.tdscpc.gov.in/",
      keywords: ["traces", "tds", "tcs", "form 16", "form 26as"],
    },
    {
      name: "Pradhan Mantri Jan Dhan Yojana",
      name_hi: "प्रधानमंत्री जन धन योजना",
      name_ta: "பிரதான் மந்திரி ஜன் தன் யோஜனா",
      description:
        "Open a bank account, get a RuPay card, set up mobile banking and access financial inclusion benefits under PMJDY.",
      description_hi:
        "बैंक खाता खोलें, RuPay कार्ड प्राप्त करें, मोबाइल बैंकिंग सेट करें और PMJDY के तहत वित्तीय समावेशन लाभ प्राप्त करें।",
      description_ta:
        "வங்கிக் கணக்கைத் திறக்கவும், RuPay அட்டையைப் பெறவும், மொபைல் வங்கியை அமைக்கவும், PMJDY இன் கீழ் நிதி உள்ளடக்க நலன்களைப் பெறவும்.",
      officialLink: "https://pmjdy.gov.in/",
      keywords: ["jan dhan", "pmjdy", "bank account", "rupay", "financial inclusion"],
    },
  ],
  "Land & Property": [
    {
      name: "Digital India Land Records (DILRMP)",
      name_hi: "डिजिटल इंडिया भूमि अभिलेख (DILRMP)",
      name_ta: "டிஜிட்டல் இந்தியா நிலப் பதிவுகள் (DILRMP)",
      description:
        "View state-wise digitised land records, mutation status, RoR (Record of Rights) and cadastral maps.",
      description_hi:
        "राज्यवार डिजिटल भूमि अभिलेख, दाखिल-खारिज स्थिति, अधिकार अभिलेख (RoR) और भू-नक्शे देखें।",
      description_ta:
        "மாநில வாரியான டிஜிட்டல் நிலப் பதிவுகள், பெயர்மாற்ற நிலை, உரிமைப் பதிவு (RoR) மற்றும் நில வரைபடங்களைப் பார்க்கவும்.",
      officialLink: "https://dilrmp.gov.in/",
      keywords: ["land", "records", "patta", "ror", "mutation", "revenue"],
    },
    {
      name: "e-Stamping (SHCIL)",
      name_hi: "ई-स्टाम्पिंग (SHCIL)",
      name_ta: "இ-ஸ்டாம்பிங் (SHCIL)",
      description:
        "Purchase non-judicial e-stamp papers online, verify authenticity and pay stamp duty for property deeds.",
      description_hi:
        "ऑनलाइन गैर-न्यायिक ई-स्टाम्प पेपर खरीदें, प्रामाणिकता सत्यापित करें और संपत्ति विलेख के लिए स्टाम्प शुल्क भुगतान करें।",
      description_ta:
        "ஆன்லைனில் நீதித்துறை அல்லாத இ-ஸ்டாம்ப் தாள்களை வாங்கவும், நம்பகத்தன்மையைச் சரிபார்க்கவும், சொத்துப் பத்திரங்களுக்கு முத்திரைக் கட்டணம் செலுத்தவும்.",
      officialLink: "https://www.shcilestamp.com/",
      keywords: ["stamp", "e-stamp", "stamp duty", "property", "shcil"],
    },
  ],
  Employment: [
    {
      name: "EPFO (Provident Fund)",
      name_hi: "EPFO (भविष्य निधि)",
      name_ta: "EPFO (வருங்கால வைப்பு நிதி)",
      description:
        "Check PF balance, download UAN passbook, transfer/withdraw PF, update KYC and file online claims.",
      description_hi:
        "पीएफ बैलेंस जाँचें, UAN पासबुक डाउनलोड करें, पीएफ स्थानांतरित/निकासी करें, KYC अपडेट करें और ऑनलाइन दावे दाखिल करें।",
      description_ta:
        "PF இருப்பைச் சரிபார்க்கவும், UAN பாஸ்புக்கைப் பதிவிறக்கவும், PF-ஐ மாற்றவும்/எடுக்கவும், KYC-ஐப் புதுப்பிக்கவும், ஆன்லைன் உரிமைகோரல்களைத் தாக்கல் செய்யவும்.",
      officialLink: "https://www.epfindia.gov.in/",
      keywords: ["epf", "pf", "uan", "provident fund", "epfo", "pension"],
    },
    {
      name: "ESIC (Employee State Insurance)",
      name_hi: "ESIC (कर्मचारी राज्य बीमा)",
      name_ta: "ESIC (ஊழியர் மாநில காப்பீடு)",
      description:
        "ESI registration for employers, employee IP number issuance, medical benefits and dispensary services.",
      description_hi:
        "नियोक्ताओं के लिए ESI पंजीकरण, कर्मचारी IP नंबर जारी करना, चिकित्सा लाभ और औषधालय सेवाएँ।",
      description_ta:
        "முதலாளிகளுக்கான ESI பதிவு, ஊழியர் IP எண் வழங்கல், மருத்துவ நலன்கள் மற்றும் மருந்தகச் சேவைகள்.",
      officialLink: "https://www.esic.gov.in/",
      keywords: ["esic", "esi", "employee state insurance", "medical", "ip"],
    },
    {
      name: "National Career Service",
      name_hi: "राष्ट्रीय करियर सेवा",
      name_ta: "தேசிய தொழில் சேவை",
      description:
        "Government job portal — search jobs, register as a jobseeker, career counselling and skill training.",
      description_hi:
        "सरकारी नौकरी पोर्टल — नौकरियाँ खोजें, नौकरी चाहने वाले के रूप में पंजीकरण करें, करियर परामर्श और कौशल प्रशिक्षण।",
      description_ta:
        "அரசு வேலை போர்ட்டல் — வேலைகளைத் தேடவும், வேலை தேடுபவராகப் பதிவு செய்யவும், தொழில் ஆலோசனை மற்றும் திறன் பயிற்சி.",
      officialLink: "https://www.ncs.gov.in/",
      keywords: ["jobs", "career", "employment", "ncs", "jobseeker", "skill"],
    },
  ],
  Health: [
    {
      name: "CoWIN (Vaccination)",
      name_hi: "कोविन (टीकाकरण)",
      name_ta: "கோவின் (தடுப்பூசி)",
      description:
        "Book vaccine slots, download COVID-19 vaccination certificate and view vaccination history.",
      description_hi:
        "वैक्सीन स्लॉट बुक करें, कोविड-19 टीकाकरण प्रमाणपत्र डाउनलोड करें और टीकाकरण इतिहास देखें।",
      description_ta:
        "தடுப்பூசி நேரங்களை முன்பதிவு செய்யவும், கோவிட்-19 தடுப்பூசிச் சான்றிதழைப் பதிவிறக்கவும், தடுப்பூசி வரலாற்றைப் பார்க்கவும்.",
      officialLink: "https://www.cowin.gov.in/",
      keywords: ["cowin", "vaccine", "covid", "certificate", "immunisation"],
    },
    {
      name: "Ayushman Bharat (PM-JAY)",
      name_hi: "आयुष्मान भारत (PM-JAY)",
      name_ta: "ஆயுஷ்மான் பாரத் (PM-JAY)",
      description:
        "Check eligibility, apply for Ayushman card and access ₹5 lakh cashless health coverage for families.",
      description_hi:
        "पात्रता जाँचें, आयुष्मान कार्ड के लिए आवेदन करें और परिवारों के लिए ₹5 लाख कैशलेस स्वास्थ्य कवरेज प्राप्त करें।",
      description_ta:
        "தகுதியைச் சரிபார்க்கவும், ஆயுஷ்மான் அட்டைக்கு விண்ணப்பிக்கவும், குடும்பங்களுக்கு ₹5 லட்சம் பணமில்லா சுகாதாரக் காப்பீட்டைப் பெறவும்.",
      officialLink: "https://pmjay.gov.in/",
      keywords: ["ayushman", "pmjay", "health", "insurance", "cashless"],
    },
    {
      name: "ABHA (Health ID)",
      name_hi: "ABHA (स्वास्थ्य आईडी)",
      name_ta: "ABHA (சுகாதார அடையாளம்)",
      description:
        "Create your Ayushman Bharat Health Account, link medical records and access unified health data.",
      description_hi:
        "अपना आयुष्मान भारत स्वास्थ्य खाता बनाएँ, चिकित्सा अभिलेख लिंक करें और एकीकृत स्वास्थ्य डेटा तक पहुँचें।",
      description_ta:
        "உங்கள் ஆயுஷ்மான் பாரத் சுகாதாரக் கணக்கை உருவாக்கவும், மருத்துவப் பதிவுகளை இணைக்கவும், ஒருங்கிணைந்த சுகாதாரத் தரவை அணுகவும்.",
      officialLink: "https://abha.abdm.gov.in/abha/v3/register",
      keywords: ["abha", "health id", "abdm", "health records", "digital health"],
    },
  ],
  Education: [
    {
      name: "DigiLocker",
      name_hi: "डिजिलॉकर",
      name_ta: "டிஜிலாக்கர்",
      description:
        "Store and share government-issued documents (marksheets, DL, RC, PAN) digitally with legal validity.",
      description_hi:
        "सरकारी दस्तावेज़ (मार्कशीट, ड्राइविंग लाइसेंस, RC, पैन) कानूनी मान्यता के साथ डिजिटल रूप से संग्रहित और साझा करें।",
      description_ta:
        "அரசு வழங்கிய ஆவணங்களை (மதிப்பெண் பட்டியல், ஓட்டுநர் உரிமம், RC, பான்) சட்டப்பூர்வ செல்லுபடியுடன் டிஜிட்டல் முறையில் சேமித்துப் பகிரவும்.",
      officialLink: "https://www.digilocker.gov.in/",
      keywords: ["digilocker", "documents", "marksheet", "certificate", "aadhaar"],
    },
    {
      name: "National Scholarship Portal",
      name_hi: "राष्ट्रीय छात्रवृत्ति पोर्टल",
      name_ta: "தேசிய உதவித்தொகை போர்ட்டல்",
      description:
        "Apply for central and state scholarships for students from minority, SC/ST/OBC and economically weaker sections.",
      description_hi:
        "अल्पसंख्यक, अनुसूचित जाति/जनजाति/OBC और आर्थिक रूप से कमज़ोर वर्ग के छात्रों के लिए केंद्रीय व राज्य छात्रवृत्ति हेतु आवेदन करें।",
      description_ta:
        "சிறுபான்மையினர், SC/ST/OBC மற்றும் பொருளாதாரத்தில் நலிந்த பிரிவு மாணவர்களுக்கான மத்திய மற்றும் மாநில உதவித்தொகைக்கு விண்ணப்பிக்கவும்.",
      officialLink: "https://scholarships.gov.in/",
      keywords: ["scholarship", "nsp", "student", "education", "financial aid"],
    },
    {
      name: "SWAYAM (Online Courses)",
      name_hi: "स्वयं (ऑनलाइन पाठ्यक्रम)",
      name_ta: "ஸ்வயம் (ஆன்லைன் பாடநெறிகள்)",
      description:
        "Free online courses from IITs, IIMs and central universities with UGC-recognised credit transfer.",
      description_hi:
        "IIT, IIM और केंद्रीय विश्वविद्यालयों से मुफ़्त ऑनलाइन पाठ्यक्रम, UGC-मान्यता प्राप्त क्रेडिट ट्रांसफर के साथ।",
      description_ta:
        "IIT-கள், IIM-கள் மற்றும் மத்திய பல்கலைக்கழகங்களிலிருந்து UGC அங்கீகரிக்கப்பட்ட கிரெடிட் பரிமாற்றத்துடன் இலவச ஆன்லைன் பாடநெறிகள்.",
      officialLink: "https://swayam.gov.in/",
      keywords: ["swayam", "moocs", "online courses", "ugc", "education"],
    },
    {
      name: "National Testing Agency (NTA)",
      name_hi: "राष्ट्रीय परीक्षा एजेंसी (NTA)",
      name_ta: "தேசிய தேர்வு நிறுவனம் (NTA)",
      description:
        "Apply for JEE, NEET, UGC NET and other central exams, download admit cards and view result notifications.",
      description_hi:
        "JEE, NEET, UGC NET और अन्य केंद्रीय परीक्षाओं के लिए आवेदन करें, प्रवेश पत्र डाउनलोड करें और परिणाम सूचनाएँ देखें।",
      description_ta:
        "JEE, NEET, UGC NET மற்றும் பிற மத்திய தேர்வுகளுக்கு விண்ணப்பிக்கவும், அனுமதி அட்டைகளைப் பதிவிறக்கவும், முடிவு அறிவிப்புகளைப் பார்க்கவும்.",
      officialLink: "https://nta.ac.in/",
      keywords: ["nta", "jee", "neet", "ugc net", "exam", "admit card"],
    },
    {
      name: "National Digital Library of India",
      name_hi: "भारत की राष्ट्रीय डिजिटल लाइब्रेरी",
      name_ta: "இந்தியாவின் தேசிய டிஜிட்டல் நூலகம்",
      description:
        "Search, read and download millions of textbooks, research papers and academic resources from Indian institutions.",
      description_hi:
        "भारतीय संस्थानों से लाखों पाठ्यपुस्तकें, शोध पत्र और शैक्षणिक संसाधन खोजें, पढ़ें और डाउनलोड करें।",
      description_ta:
        "இந்திய நிறுவனங்களிலிருந்து மில்லியன் கணக்கான பாடநூல்கள், ஆய்வுக் கட்டுரைகள் மற்றும் கல்வி வளங்களைத் தேடவும், படிக்கவும், பதிவிறக்கவும்.",
      officialLink: "https://ndl.iitkgp.ac.in/",
      keywords: ["ndl", "digital library", "textbook", "research", "academic"],
    },
  ],
  "Ration & Welfare": [
    {
      name: "One Nation One Ration Card (ONORC)",
      name_hi: "एक राष्ट्र एक राशन कार्ड (ONORC)",
      name_ta: "ஒரே நாடு ஒரே ரேஷன் அட்டை (ONORC)",
      description:
        "Portable ration card that lets beneficiaries buy subsidised food grains from any FPS across India.",
      description_hi:
        "पोर्टेबल राशन कार्ड जो लाभार्थियों को पूरे भारत में किसी भी उचित मूल्य की दुकान से सब्सिडी वाला अनाज खरीदने देता है।",
      description_ta:
        "இந்தியா முழுவதும் எந்த நியாய விலைக் கடையிலிருந்தும் மானிய உணவு தானியங்களை வாங்க பயனாளிகளை அனுமதிக்கும் கொண்டு செல்லக்கூடிய ரேஷன் அட்டை.",
      officialLink: "https://nfsa.gov.in/",
      keywords: ["ration", "onorc", "nfsa", "pds", "food security"],
    },
    {
      name: "PM Kisan Samman Nidhi",
      name_hi: "पीएम किसान सम्मान निधि",
      name_ta: "பிஎம் கிசான் சம்மான் நிதி",
      description:
        "Direct benefit transfer of ₹6,000/year to eligible farmer families in three instalments.",
      description_hi:
        "पात्र किसान परिवारों को तीन किस्तों में ₹6,000/वर्ष का प्रत्यक्ष लाभ अंतरण।",
      description_ta:
        "தகுதியான விவசாயக் குடும்பங்களுக்கு மூன்று தவணைகளில் ஆண்டுக்கு ₹6,000 நேரடி நலன் பரிமாற்றம்.",
      officialLink: "https://pmkisan.gov.in/",
      keywords: ["pm kisan", "farmer", "dbt", "samman nidhi", "agriculture"],
    },
    {
      name: "Jan Aushadhi",
      name_hi: "जन औषधि",
      name_ta: "ஜன் ஔஷதி",
      description:
        "Locate Pradhan Mantri Bhartiya Janaushadhi Kendras selling affordable generic medicines nationwide.",
      description_hi:
        "देशभर में सस्ती जेनेरिक दवाएँ बेचने वाले प्रधानमंत्री भारतीय जनऔषधि केंद्रों का पता लगाएँ।",
      description_ta:
        "நாடு முழுவதும் மலிவு விலை பொது மருந்துகளை விற்கும் பிரதான் மந்திரி பாரதிய ஜனஔஷதி மையங்களைக் கண்டறியவும்.",
      officialLink: "https://janaushadhi.gov.in/",
      keywords: ["jan aushadhi", "generic medicine", "pmbjp", "pharmacy"],
    },
  ],
  Grievance: [
    {
      name: "CPGRAMS",
      name_hi: "CPGRAMS",
      name_ta: "CPGRAMS",
      description:
        "Centralised Public Grievance Redress and Monitoring System — lodge and track complaints with any central ministry.",
      description_hi:
        "केंद्रीकृत लोक शिकायत निवारण और निगरानी प्रणाली — किसी भी केंद्रीय मंत्रालय में शिकायत दर्ज करें और ट्रैक करें।",
      description_ta:
        "மையப்படுத்தப்பட்ட பொதுக் குறை தீர்வு மற்றும் கண்காணிப்பு அமைப்பு — எந்த மத்திய அமைச்சகத்திலும் புகார்களைப் பதிவு செய்து கண்காணிக்கவும்.",
      officialLink: "https://pgportal.gov.in/",
      keywords: ["grievance", "cpgrams", "complaint", "pg portal"],
    },
    {
      name: "Consumer Helpline",
      name_hi: "उपभोक्ता हेल्पलाइन",
      name_ta: "நுகர்வோர் உதவி எண்",
      description:
        "National Consumer Helpline — file complaints against unfair trade practices and defective goods/services.",
      description_hi:
        "राष्ट्रीय उपभोक्ता हेल्पलाइन — अनुचित व्यापार प्रथाओं और दोषपूर्ण वस्तुओं/सेवाओं के विरुद्ध शिकायत दर्ज करें।",
      description_ta:
        "தேசிய நுகர்வோர் உதவி எண் — நியாயமற்ற வணிக நடைமுறைகள் மற்றும் குறைபாடுள்ள பொருட்கள்/சேவைகளுக்கு எதிராகப் புகார் அளிக்கவும்.",
      officialLink: "https://consumerhelpline.gov.in/",
      keywords: ["consumer", "complaint", "nch", "helpline", "refund"],
    },
    {
      name: "Cyber Crime Reporting",
      name_hi: "साइबर अपराध रिपोर्टिंग",
      name_ta: "சைபர் குற்றப் புகார்",
      description:
        "Report cybercrime incidents including online fraud, phishing and financial cyber crimes.",
      description_hi:
        "ऑनलाइन धोखाधड़ी, फ़िशिंग और वित्तीय साइबर अपराधों सहित साइबर अपराध की घटनाओं की रिपोर्ट करें।",
      description_ta:
        "ஆன்லைன் மோசடி, ஃபிஷிங் மற்றும் நிதி சைபர் குற்றங்கள் உள்ளிட்ட சைபர் குற்றச் சம்பவங்களைப் புகாரளிக்கவும்.",
      officialLink: "https://cybercrime.gov.in/",
      keywords: ["cyber", "fraud", "phishing", "cybercrime", "1930"],
    },
  ],
};

const categoryGuidance = {
  Identity: {
    eligibilitySummary: "Eligibility depends on the identity document or update requested; check the official portal for current rules.",
    eligibilitySummary_hi: "पात्रता अनुरोधित पहचान दस्तावेज़ या अपडेट पर निर्भर करती है; वर्तमान नियमों के लिए आधिकारिक पोर्टल देखें।",
    eligibilitySummary_ta: "தகுதி கோரப்பட்ட அடையாள ஆவணம் அல்லது புதுப்பிப்பைப் பொறுத்தது; தற்போதைய விதிகளுக்கு அதிகாரப்பூர்வ போர்ட்டலைப் பார்க்கவும்.",
    requiredDocuments: ["Proof of identity", "Proof of address", "Mobile number linked to the application"],
    requiredDocuments_hi: ["पहचान प्रमाण", "पता प्रमाण", "आवेदन से जुड़ा मोबाइल नंबर"],
    requiredDocuments_ta: ["அடையாளச் சான்று", "முகவரிச் சான்று", "விண்ணப்பத்துடன் இணைக்கப்பட்ட மொபைல் எண்"],
    commonUseCases: ["Apply for an identity document", "Correct personal details", "Download or track an identity document"],
    commonUseCases_hi: ["पहचान दस्तावेज़ के लिए आवेदन करें", "व्यक्तिगत विवरण सुधारें", "पहचान दस्तावेज़ डाउनलोड या ट्रैक करें"],
    commonUseCases_ta: ["அடையாள ஆவணத்திற்கு விண்ணப்பிக்கவும்", "தனிப்பட்ட விவரங்களைத் திருத்தவும்", "அடையாள ஆவணத்தைப் பதிவிறக்கவும் அல்லது கண்காணிக்கவும்"],
  },
  Travel: {
    eligibilitySummary: "Eligibility depends on citizenship, travel purpose, and the specific travel document requested.",
    eligibilitySummary_hi: "पात्रता नागरिकता, यात्रा उद्देश्य और अनुरोधित विशिष्ट यात्रा दस्तावेज़ पर निर्भर करती है।",
    eligibilitySummary_ta: "தகுதி குடியுரிமை, பயண நோக்கம் மற்றும் கோரப்பட்ட குறிப்பிட்ட பயண ஆவணத்தைப் பொறுத்தது.",
    requiredDocuments: ["Identity proof", "Address proof", "Recent photograph or application reference, where requested"],
    requiredDocuments_hi: ["पहचान प्रमाण", "पता प्रमाण", "हाल की तस्वीर या आवेदन संदर्भ, जहाँ आवश्यक हो"],
    requiredDocuments_ta: ["அடையாளச் சான்று", "முகவரிச் சான்று", "சமீபத்திய புகைப்படம் அல்லது விண்ணப்பக் குறிப்பு, தேவைப்படும் இடத்தில்"],
    commonUseCases: ["Apply for a passport or visa", "Renew a travel document", "Track a travel application"],
    commonUseCases_hi: ["पासपोर्ट या वीज़ा के लिए आवेदन करें", "यात्रा दस्तावेज़ नवीनीकृत करें", "यात्रा आवेदन ट्रैक करें"],
    commonUseCases_ta: ["பாஸ்போர்ட் அல்லது விசாவிற்கு விண்ணப்பிக்கவும்", "பயண ஆவணத்தைப் புதுப்பிக்கவும்", "பயண விண்ணப்பத்தைக் கண்காணிக்கவும்"],
  },
  Transport: {
    eligibilitySummary: "Eligibility depends on age, vehicle or licence status, and the transaction being requested.",
    eligibilitySummary_hi: "पात्रता आयु, वाहन या लाइसेंस स्थिति और अनुरोधित लेनदेन पर निर्भर करती है।",
    eligibilitySummary_ta: "தகுதி வயது, வாகனம் அல்லது உரிம நிலை மற்றும் கோரப்படும் பரிவர்த்தனையைப் பொறுத்தது.",
    requiredDocuments: ["Identity proof", "Address proof", "Existing licence, registration, or vehicle details where applicable"],
    requiredDocuments_hi: ["पहचान प्रमाण", "पता प्रमाण", "मौजूदा लाइसेंस, पंजीकरण या वाहन विवरण जहाँ लागू हो"],
    requiredDocuments_ta: ["அடையாளச் சான்று", "முகவரிச் சான்று", "பொருந்தும் இடத்தில் தற்போதைய உரிமம், பதிவு அல்லது வாகன விவரங்கள்"],
    commonUseCases: ["Apply for or renew a licence", "Register or transfer a vehicle", "Check a transport transaction"],
    commonUseCases_hi: ["लाइसेंस के लिए आवेदन या नवीनीकरण करें", "वाहन पंजीकृत या स्थानांतरित करें", "परिवहन लेनदेन जाँचें"],
    commonUseCases_ta: ["உரிமத்திற்கு விண்ணப்பிக்கவும் அல்லது புதுப்பிக்கவும்", "வாகனத்தைப் பதிவு செய்யவும் அல்லது மாற்றவும்", "போக்குவரத்துப் பரிவர்த்தனையைச் சரிபார்க்கவும்"],
  },
  Finance: {
    eligibilitySummary: "Eligibility depends on the taxpayer, business, account, or financial benefit involved.",
    eligibilitySummary_hi: "पात्रता संबंधित करदाता, व्यवसाय, खाते या वित्तीय लाभ पर निर्भर करती है।",
    eligibilitySummary_ta: "தகுதி சம்பந்தப்பட்ட வரிசெலுத்துபவர், வணிகம், கணக்கு அல்லது நிதி நலனைப் பொறுத்தது.",
    requiredDocuments: ["PAN or other identity proof", "Bank account details", "Relevant financial or business records"],
    requiredDocuments_hi: ["पैन या अन्य पहचान प्रमाण", "बैंक खाता विवरण", "प्रासंगिक वित्तीय या व्यावसायिक अभिलेख"],
    requiredDocuments_ta: ["பான் அல்லது பிற அடையாளச் சான்று", "வங்கிக் கணக்கு விவரங்கள்", "தொடர்புடைய நிதி அல்லது வணிகப் பதிவுகள்"],
    commonUseCases: ["File or track a financial transaction", "Register for a financial service", "Check a tax or benefit status"],
    commonUseCases_hi: ["वित्तीय लेनदेन दाखिल या ट्रैक करें", "वित्तीय सेवा के लिए पंजीकरण करें", "कर या लाभ स्थिति जाँचें"],
    commonUseCases_ta: ["நிதிப் பரிவர்த்தனையைத் தாக்கல் செய்யவும் அல்லது கண்காணிக்கவும்", "நிதிச் சேவைக்குப் பதிவு செய்யவும்", "வரி அல்லது நலன் நிலையைச் சரிபார்க்கவும்"],
  },
  "Land & Property": {
    eligibilitySummary: "Eligibility and documents vary by state, property record, and transaction type.",
    eligibilitySummary_hi: "पात्रता और दस्तावेज़ राज्य, संपत्ति अभिलेख और लेनदेन प्रकार के अनुसार भिन्न होते हैं।",
    eligibilitySummary_ta: "தகுதியும் ஆவணங்களும் மாநிலம், சொத்துப் பதிவு மற்றும் பரிவர்த்தனை வகையைப் பொறுத்து மாறுபடும்.",
    requiredDocuments: ["Identity proof", "Property or land records", "Transaction details or deed information"],
    requiredDocuments_hi: ["पहचान प्रमाण", "संपत्ति या भूमि अभिलेख", "लेनदेन विवरण या विलेख जानकारी"],
    requiredDocuments_ta: ["அடையாளச் சான்று", "சொத்து அல்லது நிலப் பதிவுகள்", "பரிவர்த்தனை விவரங்கள் அல்லது பத்திர தகவல்"],
    commonUseCases: ["Find land records", "Check mutation or ownership details", "Pay or verify property-related stamp duty"],
    commonUseCases_hi: ["भूमि अभिलेख खोजें", "दाखिल-खारिज या स्वामित्व विवरण जाँचें", "संपत्ति संबंधी स्टाम्प शुल्क भुगतान या सत्यापित करें"],
    commonUseCases_ta: ["நிலப் பதிவுகளைக் கண்டறியவும்", "பெயர்மாற்றம் அல்லது உரிமை விவரங்களைச் சரிபார்க்கவும்", "சொத்து தொடர்பான முத்திரைக் கட்டணத்தைச் செலுத்தவும் அல்லது சரிபார்க்கவும்"],
  },
  Employment: {
    eligibilitySummary: "Eligibility depends on employment status, account history, employer details, or job seeker profile.",
    eligibilitySummary_hi: "पात्रता रोज़गार स्थिति, खाता इतिहास, नियोक्ता विवरण या नौकरी चाहने वाले की प्रोफ़ाइल पर निर्भर करती है।",
    eligibilitySummary_ta: "தகுதி வேலைவாய்ப்பு நிலை, கணக்கு வரலாறு, முதலாளி விவரங்கள் அல்லது வேலை தேடுபவர் சுயவிவரத்தைப் பொறுத்தது.",
    requiredDocuments: ["Identity proof", "Employment or UAN details", "Bank details where a claim or benefit is involved"],
    requiredDocuments_hi: ["पहचान प्रमाण", "रोज़गार या UAN विवरण", "बैंक विवरण जहाँ दावा या लाभ शामिल हो"],
    requiredDocuments_ta: ["அடையாளச் சான்று", "வேலைவாய்ப்பு அல்லது UAN விவரங்கள்", "உரிமைகோரல் அல்லது நலன் சம்பந்தப்பட்ட இடத்தில் வங்கி விவரங்கள்"],
    commonUseCases: ["Check employment benefits", "Submit or track a PF or insurance request", "Find jobs or training"],
    commonUseCases_hi: ["रोज़गार लाभ जाँचें", "पीएफ या बीमा अनुरोध जमा या ट्रैक करें", "नौकरियाँ या प्रशिक्षण खोजें"],
    commonUseCases_ta: ["வேலைவாய்ப்பு நலன்களைச் சரிபார்க்கவும்", "PF அல்லது காப்பீட்டு கோரிக்கையைச் சமர்ப்பிக்கவும் அல்லது கண்காணிக்கவும்", "வேலைகள் அல்லது பயிற்சியைக் கண்டறியவும்"],
  },
  Health: {
    eligibilitySummary: "Eligibility depends on the health service, beneficiary details, and current programme rules.",
    eligibilitySummary_hi: "पात्रता स्वास्थ्य सेवा, लाभार्थी विवरण और वर्तमान कार्यक्रम नियमों पर निर्भर करती है।",
    eligibilitySummary_ta: "தகுதி சுகாதாரச் சேவை, பயனாளி விவரங்கள் மற்றும் தற்போதைய திட்ட விதிகளைப் பொறுத்தது.",
    requiredDocuments: ["Identity proof", "Mobile number", "Health or beneficiary details where applicable"],
    requiredDocuments_hi: ["पहचान प्रमाण", "मोबाइल नंबर", "स्वास्थ्य या लाभार्थी विवरण जहाँ लागू हो"],
    requiredDocuments_ta: ["அடையாளச் சான்று", "மொபைல் எண்", "பொருந்தும் இடத்தில் சுகாதார அல்லது பயனாளி விவரங்கள்"],
    commonUseCases: ["Book or download a health record", "Check health scheme eligibility", "Create or manage a health ID"],
    commonUseCases_hi: ["स्वास्थ्य अभिलेख बुक या डाउनलोड करें", "स्वास्थ्य योजना पात्रता जाँचें", "स्वास्थ्य आईडी बनाएँ या प्रबंधित करें"],
    commonUseCases_ta: ["சுகாதாரப் பதிவை முன்பதிவு செய்யவும் அல்லது பதிவிறக்கவும்", "சுகாதாரத் திட்டத் தகுதியைச் சரிபார்க்கவும்", "சுகாதார ID-ஐ உருவாக்கவும் அல்லது நிர்வகிக்கவும்"],
  },
  Education: {
    eligibilitySummary: "Eligibility depends on the course, exam, scholarship, or student category selected.",
    eligibilitySummary_hi: "पात्रता चयनित पाठ्यक्रम, परीक्षा, छात्रवृत्ति या छात्र श्रेणी पर निर्भर करती है।",
    eligibilitySummary_ta: "தகுதி தேர்ந்தெடுக்கப்பட்ட பாடநெறி, தேர்வு, உதவித்தொகை அல்லது மாணவர் வகையைப் பொறுத்தது.",
    requiredDocuments: ["Student identity details", "Academic records", "Income or category certificate where applicable"],
    requiredDocuments_hi: ["छात्र पहचान विवरण", "शैक्षणिक अभिलेख", "आय या श्रेणी प्रमाणपत्र जहाँ लागू हो"],
    requiredDocuments_ta: ["மாணவர் அடையாள விவரங்கள்", "கல்விப் பதிவுகள்", "பொருந்தும் இடத்தில் வருமானம் அல்லது வகைச் சான்றிதழ்"],
    commonUseCases: ["Apply for a scholarship or exam", "Access learning resources", "Store or share an education document"],
    commonUseCases_hi: ["छात्रवृत्ति या परीक्षा के लिए आवेदन करें", "सीखने के संसाधनों तक पहुँचें", "शिक्षा दस्तावेज़ संग्रहित या साझा करें"],
    commonUseCases_ta: ["உதவித்தொகை அல்லது தேர்வுக்கு விண்ணப்பிக்கவும்", "கற்றல் வளங்களை அணுகவும்", "கல்வி ஆவணத்தைச் சேமிக்கவும் அல்லது பகிரவும்"],
  },
  "Ration & Welfare": {
    eligibilitySummary: "Eligibility depends on household, farmer, beneficiary, or welfare programme criteria.",
    eligibilitySummary_hi: "पात्रता परिवार, किसान, लाभार्थी या कल्याण कार्यक्रम मानदंडों पर निर्भर करती है।",
    eligibilitySummary_ta: "தகுதி குடும்பம், விவசாயி, பயனாளி அல்லது நலத்திட்ட அளவுகோல்களைப் பொறுத்தது.",
    requiredDocuments: ["Identity proof", "Household or beneficiary details", "Bank details where direct transfer applies"],
    requiredDocuments_hi: ["पहचान प्रमाण", "परिवार या लाभार्थी विवरण", "बैंक विवरण जहाँ प्रत्यक्ष अंतरण लागू हो"],
    requiredDocuments_ta: ["அடையாளச் சான்று", "குடும்பம் அல்லது பயனாளி விவரங்கள்", "நேரடி பரிமாற்றம் பொருந்தும் இடத்தில் வங்கி விவரங்கள்"],
    commonUseCases: ["Check a welfare benefit", "Find or update ration information", "Locate an affordable public service"],
    commonUseCases_hi: ["कल्याण लाभ जाँचें", "राशन जानकारी खोजें या अपडेट करें", "किफ़ायती सार्वजनिक सेवा का पता लगाएँ"],
    commonUseCases_ta: ["நலன் பலனைச் சரிபார்க்கவும்", "ரேஷன் தகவலைக் கண்டறியவும் அல்லது புதுப்பிக்கவும்", "மலிவு விலை பொதுச் சேவையைக் கண்டறியவும்"],
  },
  Grievance: {
    eligibilitySummary: "Anyone with a relevant complaint or report can review the official portal's submission requirements.",
    eligibilitySummary_hi: "प्रासंगिक शिकायत या रिपोर्ट वाला कोई भी व्यक्ति आधिकारिक पोर्टल की जमा करने की आवश्यकताएँ देख सकता है।",
    eligibilitySummary_ta: "தொடர்புடைய புகார் அல்லது அறிக்கை உள்ள எவரும் அதிகாரப்பூர்வ போர்ட்டலின் சமர்ப்பிப்புத் தேவைகளைப் பார்க்கலாம்.",
    requiredDocuments: ["Contact details", "Complaint or incident description", "Supporting reference or evidence where available"],
    requiredDocuments_hi: ["संपर्क विवरण", "शिकायत या घटना का विवरण", "सहायक संदर्भ या साक्ष्य जहाँ उपलब्ध हो"],
    requiredDocuments_ta: ["தொடர்பு விவரங்கள்", "புகார் அல்லது சம்பவ விளக்கம்", "கிடைக்கும் இடத்தில் ஆதரவுக் குறிப்பு அல்லது சான்று"],
    commonUseCases: ["Lodge a complaint", "Track a grievance", "Report an online fraud or consumer issue"],
    commonUseCases_hi: ["शिकायत दर्ज करें", "शिकायत ट्रैक करें", "ऑनलाइन धोखाधड़ी या उपभोक्ता समस्या की रिपोर्ट करें"],
    commonUseCases_ta: ["புகாரைப் பதிவு செய்யவும்", "குறையைக் கண்காணிக்கவும்", "ஆன்லைன் மோசடி அல்லது நுகர்வோர் சிக்கலைப் புகாரளிக்கவும்"],
  },
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Service.deleteMany({});
    await Category.deleteMany({});
    console.log("🧹 Cleared existing categories & services");

    let totalServices = 0;
    for (const [categoryName, services] of Object.entries(data)) {
      const category = await Category.create({ name: categoryName });
      const withCat = services.map((s) => ({
        ...s,
        ...categoryGuidance[categoryName],
        category: category._id,
      }));
      await Service.insertMany(withCat);
      totalServices += services.length;
      console.log(`   • ${categoryName}: ${services.length} services`);
    }

    console.log(
      `\n🌱 Seed complete → ${Object.keys(data).length} categories, ${totalServices} services`
    );
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
