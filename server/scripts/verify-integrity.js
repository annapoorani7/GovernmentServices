import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import Service from "../models/Service.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/govservices";

async function auditData() {
  await mongoose.connect(MONGO_URI);
  console.log("=== DATABASE INTEGRITY AUDIT RESULTS ===");

  const categories = await Category.find().lean();
  const services = await Service.find().lean();

  console.log(`1. Categories defined in seed script: 10 categories`);
  console.log(`2. Categories existing in MongoDB: ${categories.length}`);
  console.log(`3. Services existing in MongoDB: ${services.length}`);

  // Check duplicate categories
  const catNames = categories.map((c) => c.name);
  const uniqueCatNames = new Set(catNames);
  console.log(`4. Duplicate categories: ${catNames.length - uniqueCatNames.size}`);

  // Check service category references
  const catIds = new Set(categories.map((c) => c._id.toString()));
  let missingCatRefs = 0;
  let invalidCatRefs = 0;

  services.forEach((s) => {
    if (!s.category) {
      missingCatRefs++;
    } else if (!catIds.has(s.category.toString())) {
      invalidCatRefs++;
    }
  });

  console.log(`5. Services with missing category reference: ${missingCatRefs}`);
  console.log(`6. Services with invalid/nonexistent category reference: ${invalidCatRefs}`);

  // Check official links
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  let missingLinks = 0;
  let invalidLinks = 0;

  services.forEach((s) => {
    if (!s.officialLink) {
      missingLinks++;
    } else if (!urlRegex.test(s.officialLink)) {
      invalidLinks++;
    }
  });

  console.log(`7. Services with missing officialLink: ${missingLinks}`);
  console.log(`8. Services with invalid officialLink URL: ${invalidLinks}`);
  console.log("==========================================");

  await mongoose.disconnect();
}

auditData().catch(console.error);
