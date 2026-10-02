import mongoose, { Schema } from "mongoose";
import type { DemoCase } from "../types.js";

const CaseSchema = new Schema<DemoCase>(
  {
    id: { type: String, required: true, unique: true },
    caseName: { type: String, required: true },
    citation: { type: String, required: true },
    court: { type: String, required: true },
    year: { type: Number, required: true },
    province: { type: String, enum: ["BC"], required: true },
    practiceArea: { type: String, required: true },
    issues: [{ type: String, required: true }],
    lawyerId: { type: String, required: true, index: true },
    representedSide: { type: String, required: true },
    summary: { type: String, required: true },
    sourceUrl: { type: String, required: true },
    isDemo: { type: Boolean, required: true, default: true }
  },
  { timestamps: true }
);

export const CaseModel =
  mongoose.models.Case || mongoose.model<DemoCase>("Case", CaseSchema);
