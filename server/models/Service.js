import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    name_hi: {
      type: String,
      trim: true,
    },
    name_ta: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Service description is required"],
      trim: true,
    },
    description_hi: {
      type: String,
      trim: true,
    },
    description_ta: {
      type: String,
      trim: true,
    },
    officialLink: {
      type: String,
      required: [true, "Official link is required"],
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
        "Please provide a valid URL for officialLink",
      ],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category reference is required"],
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    eligibilitySummary: {
      type: String,
      trim: true,
      default: "Check the official portal for current eligibility requirements.",
    },
    eligibilitySummary_hi: {
      type: String,
      trim: true,
    },
    eligibilitySummary_ta: {
      type: String,
      trim: true,
    },
    requiredDocuments: [
      {
        type: String,
        trim: true,
      },
    ],
    requiredDocuments_hi: [
      {
        type: String,
        trim: true,
      },
    ],
    requiredDocuments_ta: [
      {
        type: String,
        trim: true,
      },
    ],
    commonUseCases: [
      {
        type: String,
        trim: true,
      },
    ],
    commonUseCases_hi: [
      {
        type: String,
        trim: true,
      },
    ],
    commonUseCases_ta: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

// Indexes to optimize filter and search queries
serviceSchema.index({ category: 1 });
serviceSchema.index({ name: 1 });
serviceSchema.index({ keywords: 1 });

export default mongoose.model("Service", serviceSchema);

