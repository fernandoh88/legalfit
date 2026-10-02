import type { DemoCase, Lawyer, LawyerMatch, LegalClassification, LegalIntake } from "./types";

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body?.error?.message ?? "Request failed");
  }

  return body as T;
};

export const classifyIntake = (intake: LegalIntake) =>
  request<{ intake: LegalIntake; classification: LegalClassification }>("/api/intake/classify", {
    method: "POST",
    body: JSON.stringify(intake)
  });

export const getMatches = (intake: LegalIntake, classification: LegalClassification) =>
  request<{ classification: LegalClassification; matches: LawyerMatch[] }>("/api/matches", {
    method: "POST",
    body: JSON.stringify({ intake, classification })
  });

export const getLawyer = (id: string) =>
  request<{ lawyer: Lawyer }>(`/api/lawyers/${encodeURIComponent(id)}`);

export const getLawyerCases = (id: string) =>
  request<{ cases: DemoCase[] }>(`/api/lawyers/${encodeURIComponent(id)}/cases`);
