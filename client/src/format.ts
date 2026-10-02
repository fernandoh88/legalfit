const labels: Record<string, string> = {
  employment: "Employment Law",
  family: "Family Law",
  criminal: "Criminal Law",
  immigration: "Immigration Law",
  "personal-injury": "Personal Injury",
  "real-estate": "Real Estate",
  business: "Business Law",
  "civil-litigation": "Civil Litigation",
  "landlord-tenant": "Landlord & Tenant",
  "wills-estates": "Wills & Estates",
  "human-rights": "Human Rights",
  other: "Other"
};

export const formatPracticeArea = (value: string) =>
  labels[value] ??
  value
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const formatIssue = (value: string) =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
