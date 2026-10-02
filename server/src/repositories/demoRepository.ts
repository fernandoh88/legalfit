import { cases, lawyers } from "../data/demoData.js";

export const getLawyers = () => lawyers;

export const getLawyerByIdOrSlug = (idOrSlug: string) =>
  lawyers.find((lawyer) => lawyer.id === idOrSlug || lawyer.slug === idOrSlug);

export const getCases = () => cases;

export const getCasesByLawyer = (lawyerId: string) =>
  cases
    .filter((demoCase) => demoCase.lawyerId === lawyerId)
    .sort((a, b) => b.year - a.year);
