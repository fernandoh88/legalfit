import { Router } from "express";
import { getCasesByLawyer, getLawyerByIdOrSlug, getLawyers } from "../repositories/demoRepository.js";
import { notFound } from "../middleware/errorHandler.js";

export const lawyersRouter = Router();

lawyersRouter.get("/", (_req, res) => {
  res.json({ lawyers: getLawyers() });
});

lawyersRouter.get("/:id", (req, res, next) => {
  try {
    const lawyer = getLawyerByIdOrSlug(req.params.id);
    if (!lawyer) {
      throw notFound("Lawyer not found");
    }

    res.json({ lawyer });
  } catch (error) {
    next(error);
  }
});

lawyersRouter.get("/:id/cases", (req, res, next) => {
  try {
    const lawyer = getLawyerByIdOrSlug(req.params.id);
    if (!lawyer) {
      throw notFound("Lawyer not found");
    }

    res.json({ cases: getCasesByLawyer(lawyer.id) });
  } catch (error) {
    next(error);
  }
});
