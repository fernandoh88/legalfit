import type { DemoCase, Lawyer } from "../types.js";

export const lawyers: Lawyer[] = [
  {
    id: "lawyer-ava-chen",
    name: "Ava Chen",
    slug: "ava-chen",
    city: "Vancouver",
    province: "BC",
    yearsPractising: 12,
    languages: ["English", "Mandarin"],
    practiceAreas: ["Employment Law", "Human Rights"],
    bio: "Fictional demo lawyer focused on workplace disputes and employment-related negotiations.",
    caseExperience: [
      { practiceArea: "Employment Law", issues: ["Wrongful dismissal", "Severance", "Reasonable notice"], count: 47 },
      { practiceArea: "Human Rights", issues: ["Workplace accommodation", "Discrimination"], count: 11 }
    ]
  },
  {
    id: "lawyer-marcus-reid",
    name: "Marcus Reid",
    slug: "marcus-reid",
    city: "Burnaby",
    province: "BC",
    yearsPractising: 9,
    languages: ["English"],
    practiceAreas: ["Employment Law", "Contract Disputes"],
    bio: "Fictional demo lawyer with experience in termination clauses and employment contracts.",
    caseExperience: [
      { practiceArea: "Employment Law", issues: ["Termination clauses", "Severance", "Constructive dismissal"], count: 31 },
      { practiceArea: "Contract Disputes", issues: ["Contract interpretation"], count: 9 }
    ]
  },
  {
    id: "lawyer-nadia-singh",
    name: "Nadia Singh",
    slug: "nadia-singh",
    city: "Surrey",
    province: "BC",
    yearsPractising: 14,
    languages: ["English", "Punjabi", "Hindi"],
    practiceAreas: ["Family Law"],
    bio: "Fictional demo lawyer focused on parenting arrangements, support, and separation disputes.",
    caseExperience: [
      { practiceArea: "Family Law", issues: ["Custody", "Parenting time", "Separation", "Support"], count: 55 }
    ]
  },
  {
    id: "lawyer-elena-morales",
    name: "Elena Morales",
    slug: "elena-morales",
    city: "New Westminster",
    province: "BC",
    yearsPractising: 8,
    languages: ["English", "Spanish"],
    practiceAreas: ["Landlord & Tenant", "Civil Litigation"],
    bio: "Fictional demo lawyer with tenancy dispute and residential lease experience.",
    caseExperience: [
      { practiceArea: "Landlord & Tenant", issues: ["Tenancy dispute", "Damage deposit", "Rent arrears"], count: 38 },
      { practiceArea: "Civil Litigation", issues: ["Small claims"], count: 12 }
    ]
  },
  {
    id: "lawyer-samuel-okafor",
    name: "Samuel Okafor",
    slug: "samuel-okafor",
    city: "Richmond",
    province: "BC",
    yearsPractising: 11,
    languages: ["English", "French"],
    practiceAreas: ["Criminal Law"],
    bio: "Fictional demo lawyer focused on criminal defence matters and police procedure issues.",
    caseExperience: [
      { practiceArea: "Criminal Law", issues: ["Assault", "Arrest", "Police search", "Bail"], count: 44 }
    ]
  },
  {
    id: "lawyer-priya-kapoor",
    name: "Priya Kapoor",
    slug: "priya-kapoor",
    city: "Vancouver",
    province: "BC",
    yearsPractising: 6,
    languages: ["English", "Hindi"],
    practiceAreas: ["Landlord & Tenant", "Employment Law"],
    bio: "Fictional demo lawyer with a mixed practice in tenancy and workplace disputes.",
    caseExperience: [
      { practiceArea: "Landlord & Tenant", issues: ["Eviction", "Repairs", "Tenancy dispute"], count: 24 },
      { practiceArea: "Employment Law", issues: ["Unpaid wages", "Severance"], count: 10 }
    ]
  },
  {
    id: "lawyer-thomas-bennett",
    name: "Thomas Bennett",
    slug: "thomas-bennett",
    city: "Burnaby",
    province: "BC",
    yearsPractising: 17,
    languages: ["English"],
    practiceAreas: ["Civil Litigation", "Contract Disputes"],
    bio: "Fictional demo lawyer focused on commercial and civil disputes.",
    caseExperience: [
      { practiceArea: "Civil Litigation", issues: ["Negligence", "Property dispute"], count: 29 },
      { practiceArea: "Contract Disputes", issues: ["Breach of contract", "Contract interpretation"], count: 26 }
    ]
  },
  {
    id: "lawyer-amira-hassan",
    name: "Amira Hassan",
    slug: "amira-hassan",
    city: "New Westminster",
    province: "BC",
    yearsPractising: 10,
    languages: ["English", "Arabic"],
    practiceAreas: ["Family Law", "Criminal Law"],
    bio: "Fictional demo lawyer with experience across family disputes and select criminal matters.",
    caseExperience: [
      { practiceArea: "Family Law", issues: ["Separation", "Protection orders", "Parenting time"], count: 30 },
      { practiceArea: "Criminal Law", issues: ["Bail", "Assault"], count: 14 }
    ]
  }
];

type CaseSeed = [
  caseName: string,
  citation: string,
  court: string,
  year: number,
  practiceArea: string,
  issues: string[],
  lawyerId: string,
  representedSide: string,
  summary: string
];

const summaries: Array<Omit<DemoCase, "id" | "isDemo" | "sourceUrl" | "province">> = ([
  ["Smith v. Northstar Technologies Ltd.", "2025 BCSC DEMO-101", "BC Supreme Court", 2025, "Employment Law", ["Wrongful dismissal", "Reasonable notice", "Termination"], "lawyer-ava-chen", "Employee", "Fictional dispute about notice after long-term employment ended."],
  ["Lee v. Cascadia Foods Inc.", "2024 BCSC DEMO-118", "BC Supreme Court", 2024, "Employment Law", ["Severance", "Wrongful dismissal"], "lawyer-ava-chen", "Employee", "Fictional severance dispute involving managerial duties."],
  ["Patel v. Harbour Analytics Corp.", "2023 BCCA DEMO-042", "BC Court of Appeal", 2023, "Employment Law", ["Reasonable notice", "Mitigation"], "lawyer-ava-chen", "Employee", "Fictional appeal concerning notice period analysis."],
  ["Nguyen v. Fraser Health Tools Ltd.", "2022 BCSC DEMO-210", "BC Supreme Court", 2022, "Employment Law", ["Termination", "Severance"], "lawyer-ava-chen", "Employee", "Fictional termination package dispute."],
  ["Roberts v. Pacific Studio Group", "2021 BCHRT DEMO-033", "BC Human Rights Tribunal", 2021, "Human Rights", ["Workplace accommodation", "Discrimination"], "lawyer-ava-chen", "Worker", "Fictional workplace accommodation matter."],
  ["Brown v. Metro Components Ltd.", "2025 BCSC DEMO-066", "BC Supreme Court", 2025, "Employment Law", ["Termination clauses", "Severance"], "lawyer-marcus-reid", "Employee", "Fictional dispute about enforceability of a termination clause."],
  ["Garcia v. Summit Retail BC Inc.", "2024 BCSC DEMO-077", "BC Supreme Court", 2024, "Employment Law", ["Constructive dismissal", "Reduced hours"], "lawyer-marcus-reid", "Employee", "Fictional constructive dismissal dispute after schedule changes."],
  ["Wilson v. Island Logistics Ltd.", "2023 BCSC DEMO-088", "BC Supreme Court", 2023, "Employment Law", ["Severance", "Termination clauses"], "lawyer-marcus-reid", "Employer", "Fictional severance and contract interpretation dispute."],
  ["Kaur v. Evergreen Rentals", "2025 BCCRT DEMO-302", "Civil Resolution Tribunal", 2025, "Landlord & Tenant", ["Damage deposit", "Tenancy dispute"], "lawyer-elena-morales", "Tenant", "Fictional damage deposit dispute after move-out."],
  ["Miller v. Columbia View Apartments", "2024 BCSC DEMO-141", "BC Supreme Court", 2024, "Landlord & Tenant", ["Rent arrears", "Eviction"], "lawyer-elena-morales", "Landlord", "Fictional residential tenancy dispute involving unpaid rent."],
  ["Tran v. Royal City Housing", "2023 BCCRT DEMO-188", "Civil Resolution Tribunal", 2023, "Landlord & Tenant", ["Repairs", "Tenancy dispute"], "lawyer-elena-morales", "Tenant", "Fictional dispute about repairs and habitability."],
  ["Olsen v. Queensborough Homes", "2022 BCCRT DEMO-202", "Civil Resolution Tribunal", 2022, "Landlord & Tenant", ["Damage deposit", "Repairs"], "lawyer-elena-morales", "Tenant", "Fictional claim involving deposit deductions."],
  ["Singh v. Valley Co-Parents", "2025 BCSC DEMO-501", "BC Supreme Court", 2025, "Family Law", ["Custody", "Parenting time"], "lawyer-nadia-singh", "Parent", "Fictional parenting arrangement dispute."],
  ["Ahmed v. Ahmed", "2024 BCSC DEMO-512", "BC Supreme Court", 2024, "Family Law", ["Separation", "Support"], "lawyer-nadia-singh", "Spouse", "Fictional separation and support proceeding."],
  ["Chen v. Li", "2023 BCSC DEMO-523", "BC Supreme Court", 2023, "Family Law", ["Custody", "Relocation"], "lawyer-nadia-singh", "Parent", "Fictional parenting and relocation matter."],
  ["Morgan v. Morgan", "2022 BCSC DEMO-534", "BC Supreme Court", 2022, "Family Law", ["Parenting time", "Support"], "lawyer-nadia-singh", "Parent", "Fictional parenting time and support dispute."],
  ["R. v. Dawson", "2025 BCPC DEMO-701", "BC Provincial Court", 2025, "Criminal Law", ["Arrest", "Bail"], "lawyer-samuel-okafor", "Accused", "Fictional bail hearing after an arrest."],
  ["R. v. Martins", "2024 BCSC DEMO-712", "BC Supreme Court", 2024, "Criminal Law", ["Police search", "Charter"], "lawyer-samuel-okafor", "Accused", "Fictional application concerning a police search."],
  ["R. v. Clarke", "2023 BCPC DEMO-723", "BC Provincial Court", 2023, "Criminal Law", ["Assault", "Bail"], "lawyer-samuel-okafor", "Accused", "Fictional assault allegation with release conditions."],
  ["R. v. Ibrahim", "2022 BCPC DEMO-734", "BC Provincial Court", 2022, "Criminal Law", ["Arrest", "Police procedure"], "lawyer-samuel-okafor", "Accused", "Fictional challenge involving arrest procedure."],
  ["Park v. Cedar Lane Rentals", "2025 BCCRT DEMO-341", "Civil Resolution Tribunal", 2025, "Landlord & Tenant", ["Eviction", "Tenancy dispute"], "lawyer-priya-kapoor", "Tenant", "Fictional eviction-related tenancy dispute."],
  ["Lopez v. Westside Flats", "2024 BCCRT DEMO-352", "Civil Resolution Tribunal", 2024, "Landlord & Tenant", ["Repairs", "Rent"], "lawyer-priya-kapoor", "Tenant", "Fictional rent abatement and repair dispute."],
  ["Evans v. Portside Cafe Ltd.", "2023 BCSC DEMO-363", "BC Supreme Court", 2023, "Employment Law", ["Unpaid wages", "Severance"], "lawyer-priya-kapoor", "Employee", "Fictional unpaid wages and severance dispute."],
  ["BrightPath Supply v. Lee", "2025 BCSC DEMO-801", "BC Supreme Court", 2025, "Contract Disputes", ["Breach of contract", "Contract interpretation"], "lawyer-thomas-bennett", "Company", "Fictional commercial contract interpretation dispute."],
  ["River Market Holdings v. Stone", "2024 BCSC DEMO-812", "BC Supreme Court", 2024, "Civil Litigation", ["Property dispute", "Injunction"], "lawyer-thomas-bennett", "Owner", "Fictional property dispute involving interim relief."],
  ["Oak & Pine Builders v. Delta Fixtures", "2023 BCSC DEMO-823", "BC Supreme Court", 2023, "Contract Disputes", ["Breach of contract", "Damages"], "lawyer-thomas-bennett", "Contractor", "Fictional contract damages dispute."],
  ["Hassan v. Hassan", "2025 BCSC DEMO-611", "BC Supreme Court", 2025, "Family Law", ["Separation", "Protection orders"], "lawyer-amira-hassan", "Spouse", "Fictional separation dispute involving safety concerns."],
  ["R. v. Ellis", "2024 BCPC DEMO-744", "BC Provincial Court", 2024, "Criminal Law", ["Bail", "Assault"], "lawyer-amira-hassan", "Accused", "Fictional bail matter involving an assault allegation."],
  ["Foster v. Foster", "2023 BCSC DEMO-622", "BC Supreme Court", 2023, "Family Law", ["Parenting time", "Separation"], "lawyer-amira-hassan", "Parent", "Fictional parenting schedule dispute after separation."],
  ["R. v. Novak", "2022 BCPC DEMO-755", "BC Provincial Court", 2022, "Criminal Law", ["Police search", "Bail"], "lawyer-amira-hassan", "Accused", "Fictional police search and release condition matter."]
  ] satisfies CaseSeed[]).map(([caseName, citation, court, year, practiceArea, issues, lawyerId, representedSide, summary]) => ({
  caseName,
  citation,
  court,
  year,
  practiceArea,
  issues,
  lawyerId,
  representedSide,
  summary
}));

export const cases: DemoCase[] = summaries.map((demoCase, index) => ({
  id: `case-${String(index + 1).padStart(3, "0")}`,
  province: "BC",
  sourceUrl: "https://example.com/legalfit/fictional-demo-case",
  isDemo: true,
  ...demoCase
}));
