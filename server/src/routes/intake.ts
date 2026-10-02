import { Router } from "express";
import rateLimit from "express-rate-limit";
import { intakeSchema } from "../schemas.js";
import { createLegalClassifier } from "../services/classifierFactory.js";

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
const max = Number(process.env.RATE_LIMIT_MAX ?? 20);

export const intakeRouter = Router();

const intakeRateLimit = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: "Too many intake requests. Please try again shortly." } }
});

const classifier = createLegalClassifier();

intakeRouter.post("/classify", intakeRateLimit, async (req, res, next) => {
  try {
    const intake = intakeSchema.parse(req.body);
    const classification = await classifier.classifyLegalProblem(intake.description);
    res.json({ intake, classification });
  } catch (error) {
    next(error);
  }
});
