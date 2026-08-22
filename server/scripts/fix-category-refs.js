import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import Service from "../models/Service.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/govservices";

async function migrateCategoryRefs() {
  await mongoose.connect(MONGO_URI);
  console.log(`Connected to ${MONGO_URI}`);

  const services = await Service.find().lean();
  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const service of services) {
    const categoryValue = service.category;

    if (typeof categoryValue !== "string") {
      skipped += 1;
      continue;
    }

    if (!mongoose.isValidObjectId(categoryValue)) {
      console.warn(`Skipping service ${service._id}: category is not a valid ObjectId string`);
      missing += 1;
      continue;
    }

    const category = await Category.findById(categoryValue);
    if (!category) {
      console.warn(`Skipping service ${service._id}: category id ${categoryValue} does not exist`);
      missing += 1;
      continue;
    }

    await Service.updateOne(
      { _id: service._id },
      { $set: { category: new mongoose.Types.ObjectId(categoryValue) } }
    );

    updated += 1;
  }

  console.log(`Migration complete: ${updated} updated, ${skipped} already normalized, ${missing} skipped`);
  await mongoose.disconnect();
  process.exit(0);
}

migrateCategoryRefs().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
