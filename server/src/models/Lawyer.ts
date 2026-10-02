import mongoose, { Schema } from "mongoose";
import type { Lawyer } from "../types.js";

const CaseExperienceSchema = new Schema(
  {
    practiceArea: { type: String, required: true },
    issues: [{ type: String, required: true }],
    count: { type: Number, required: true }
  },
  { _id: false }
);

const LawyerSchema = new Schema<Lawyer>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    province: { type: String, enum: ["BC"], required: true },
    yearsPractising: { type: Number, required: true },
    languages: [{ type: String, required: true }],
    practiceAreas: [{ type: String, required: true }],
    bio: { type: String, required: true },
    caseExperience: [CaseExperienceSchema]
  },
  { timestamps: true }
);

export const LawyerModel =
  mongoose.models.Lawyer || mongoose.model<Lawyer>("Lawyer", LawyerSchema);
