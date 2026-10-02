export type ProvinceCode = "BC";

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
  province: ProvinceCode;
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
  province: ProvinceCode;
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
  province: ProvinceCode;
}

export type LegalPracticeArea =
  | "employment"
  | "family"
  | "criminal"
  | "immigration"
  | "personal-injury"
  | "real-estate"
  | "business"
  | "civil-litigation"
  | "landlord-tenant"
  | "wills-estates"
  | "human-rights"
  | "other";

export interface LegalClassification {
  primaryArea: LegalPracticeArea | string;
  issues: string[];
  userRole: string;
  urgency: "low" | "normal" | "medium" | "high" | "emergency";
  needsMoreInformation: boolean;
  followUpQuestions: string[];
  summary?: string;
}

export interface MatchBreakdown {
  practiceArea: number;
  issueOverlap: number;
  location: number;
  experienceVolume: number;
}

export interface LawyerMatch {
  lawyer: Lawyer;
  relevantCaseCount: number;
  relevantIssues: string[];
  experienceMatch: number;
  explanation: string;
  breakdown: MatchBreakdown;
}
