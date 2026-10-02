import { Router } from "express";
import { matchRequestSchema } from "../schemas.js";
import { getCases, getLawyers } from "../repositories/demoRepository.js";
import { LawyerMatchingService } from "../services/LawyerMatchingService.js";

export const matchesRouter = Router();

matchesRouter.post("/", (req, res, next) => {
  try {
    const { intake, classification } = matchRequestSchema.parse(req.body);
    const service = new LawyerMatchingService(getLawyers(), getCases());
    res.json({
      classification,
      matches: service.findMatches(intake, classification)
    });
  } catch (error) {
    next(error);
  }
});
