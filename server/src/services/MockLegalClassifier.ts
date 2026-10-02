import type { LegalClassification } from "../types.js";
import type { LegalClassifier } from "./LegalClassifier.js";

interface Rule {
  keywords: string[];
  classification: LegalClassification;
}

const rules: Rule[] = [
  {
    keywords: ["termination", "terminated", "fired", "severance", "dismissed", "laid off"],
    classification: {
      primaryArea: "employment",
      issues: ["wrongful dismissal", "severance", "reasonable notice"],
      userRole: "employee",
      urgency: "normal",
      needsMoreInformation: false,
      followUpQuestions: [],
      summary: "Employment termination involving severance and notice concerns."
    }
  },
  {
    keywords: ["landlord", "rent", "deposit", "tenant", "eviction", "repairs", "lease"],
    classification: {
      primaryArea: "landlord-tenant",
      issues: ["tenancy dispute", "damage deposit", "rent or repairs"],
      userRole: "tenant or landlord",
      urgency: "normal",
      needsMoreInformation: false,
      followUpQuestions: [],
      summary: "Residential tenancy issue involving rent, deposits, repairs, or occupancy."
    }
  },
  {
    keywords: ["divorce", "separation", "custody", "parenting", "child support", "spousal"],
    classification: {
      primaryArea: "family",
      issues: ["separation", "custody", "parenting time", "support"],
      userRole: "family law party",
      urgency: "normal",
      needsMoreInformation: false,
      followUpQuestions: [],
      summary: "Family matter involving separation, parenting, custody, or support concerns."
    }
  },
  {
    keywords: ["charged", "arrested", "police", "bail", "assault", "search warrant"],
    classification: {
      primaryArea: "criminal",
      issues: ["arrest", "bail", "police procedure"],
      userRole: "accused person or affected party",
      urgency: "high",
      needsMoreInformation: false,
      followUpQuestions: [],
      summary: "Criminal law matter involving police, arrest, bail, or charges."
    }
  }
];

export class MockLegalClassifier implements LegalClassifier {
  async classifyLegalProblem(description: string): Promise<LegalClassification> {
    const normalized = description.toLowerCase();
    const matchedRule = rules.find((rule) =>
      rule.keywords.some((keyword) => normalized.includes(keyword))
    );

    if (matchedRule) {
      return matchedRule.classification;
    }

    return {
      primaryArea: "civil-litigation",
      issues: ["needs review"],
      userRole: "potential client",
      urgency: "low",
      needsMoreInformation: true,
      followUpQuestions: [
        "What type of person or organization is on the other side?",
        "Are there any deadlines, hearings, or notices?"
      ],
      summary: "General dispute requiring more information before matching."
    };
  }
}
