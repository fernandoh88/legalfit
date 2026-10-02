import { z } from "zod";

export const provinceSchema = z.literal("BC", {
  errorMap: () => ({ message: "Only British Columbia is supported in this MVP." })
});

export const intakeSchema = z.object({
  description: z
    .string()
    .trim()
    .min(20, "Please provide at least 20 characters.")
    .max(2500, "Description must be 2,500 characters or less."),
  city: z.string().trim().min(2).max(80),
  province: provinceSchema
});

export const primaryAreaSchema = z.enum([
  "employment",
  "family",
  "criminal",
  "immigration",
  "personal-injury",
  "real-estate",
  "business",
  "civil-litigation",
  "landlord-tenant",
  "wills-estates",
  "human-rights",
  "other"
]);

const classificationBaseSchema = z.object({
  issues: z.array(z.string().trim().min(2)).min(1).max(8),
  userRole: z.string().trim().min(2).max(80),
  urgency: z.enum(["low", "normal", "medium", "high", "emergency"]),
  needsMoreInformation: z.boolean(),
  followUpQuestions: z.array(z.string().trim().min(5).max(160)).max(3),
  summary: z.string().trim().min(5).max(220).optional()
});

export const classificationSchema = classificationBaseSchema.extend({
  primaryArea: primaryAreaSchema.or(z.string().min(2))
});

export const aiClassificationSchema = classificationBaseSchema.extend({
  primaryArea: primaryAreaSchema,
  urgency: z.enum(["low", "normal", "high", "emergency"]),
  summary: z.string().trim().min(5).max(220)
});

export const matchRequestSchema = z.object({
  intake: intakeSchema,
  classification: classificationSchema
});
