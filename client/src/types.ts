export interface CaseExperienceSummary {
  practiceArea: string;
  issues: string[];
  count: number;
}

export interface Lawyer {
  id: string;
  name: string;
  slug: string;
  city: string;
  province: "BC";
  yearsPractising: number;
  languages: string[];
  practiceAreas: string[];
  bio: string;
  caseExperience: CaseExperienceSummary[];
}

export interface DemoCase {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  year: number;
  province: "BC";
  practiceArea: string;
  issues: string[];
  lawyerId: string;
  representedSide: string;
  summary: string;
  sourceUrl: string;
  isDemo: true;
}

export interface LegalIntake {
  description: string;
  city: string;
  province: "BC";
}

export interface LegalClassification {
  primaryArea: string;
  issues: string[];
  userRole: string;
  urgency: "low" | "normal" | "medium" | "high" | "emergency";
  needsMoreInformation: boolean;
  followUpQuestions: string[];
  summary?: string;
}

export interface LawyerMatch {
  lawyer: Lawyer;
  relevantCaseCount: number;
  relevantIssues: string[];
  experienceMatch: number;
  explanation: string;
}

export interface ResultsState {
  intake: LegalIntake;
  classification: LegalClassification;
  matches: LawyerMatch[];
}
