import type { LegalClassification } from "../types.js";

export interface LegalClassifier {
  classifyLegalProblem(description: string): Promise<LegalClassification>;
}
