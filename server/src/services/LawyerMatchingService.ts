import type { DemoCase, Lawyer, LawyerMatch, LegalClassification, LegalIntake } from "../types.js";

const normalize = (value: string) => value.trim().toLowerCase();

const unique = (values: string[]) => [...new Set(values)];

const areaAliases: Record<string, string> = {
  employment: "employment law",
  family: "family law",
  criminal: "criminal law",
  "landlord-tenant": "landlord & tenant",
  "civil-litigation": "civil litigation",
  business: "contract disputes",
  "human-rights": "human rights",
  "personal-injury": "personal injury",
  "real-estate": "real estate",
  "wills-estates": "wills & estates"
};

const normalizedArea = (area: string) => areaAliases[normalize(area)] ?? normalize(area);

export class LawyerMatchingService {
  constructor(
    private readonly lawyers: Lawyer[],
    private readonly cases: DemoCase[]
  ) {}

  findMatches(intake: LegalIntake, classification: LegalClassification): LawyerMatch[] {
    return this.lawyers
      .map((lawyer) => this.scoreLawyer(lawyer, intake, classification))
      .filter((match) => match.experienceMatch > 0)
      .sort((a, b) => b.experienceMatch - a.experienceMatch);
  }

  private scoreLawyer(
    lawyer: Lawyer,
    intake: LegalIntake,
    classification: LegalClassification
  ): LawyerMatch {
    const lawyerAreas = lawyer.practiceAreas.map(normalizedArea);
    const targetArea = normalizedArea(classification.primaryArea);
    const practiceArea = lawyerAreas.includes(targetArea) ? 35 : 0;

    const classifiedIssues = classification.issues.map(normalize);
    const lawyerCases = this.cases.filter((demoCase) => demoCase.lawyerId === lawyer.id);
    const relevantCases = lawyerCases.filter(
      (demoCase) =>
        normalizedArea(demoCase.practiceArea) === targetArea ||
        demoCase.issues.some((issue) => classifiedIssues.includes(normalize(issue)))
    );

    const issueHits = unique(
      relevantCases.flatMap((demoCase) =>
        demoCase.issues.filter((issue) => classifiedIssues.includes(normalize(issue)))
      )
    );
    const issueOverlap =
      classifiedIssues.length === 0
        ? 0
        : Math.round((issueHits.length / classifiedIssues.length) * 35);

    const sameProvince = lawyer.province === intake.province;
    const sameCity = normalize(lawyer.city) === normalize(intake.city);
    const location = sameCity ? 15 : sameProvince ? 10 : 0;

    const experienceVolume = Math.min(15, relevantCases.length * 3);
    const score = Math.min(100, practiceArea + issueOverlap + location + experienceVolume);

    return {
      lawyer,
      relevantCaseCount: relevantCases.length,
      relevantIssues: unique(relevantCases.flatMap((demoCase) => demoCase.issues)).slice(0, 6),
      experienceMatch: score,
      explanation:
        "Based on similarity between your legal issue and this lawyer's demonstrated practice experience.",
      breakdown: {
        practiceArea,
        issueOverlap,
        location,
        experienceVolume
      }
    };
  }
}
