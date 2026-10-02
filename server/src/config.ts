export type ClassifierMode = "mock" | "openai";

export interface AppConfig {
  classifierMode: ClassifierMode;
  openAiApiKey?: string;
  openAiModel: string;
  openAiTimeoutMs: number;
}

const readClassifierMode = (): ClassifierMode => {
  const mode = process.env.LEGAL_CLASSIFIER ?? "mock";

  if (mode === "mock" || mode === "openai") {
    return mode;
  }

  throw new Error("LEGAL_CLASSIFIER must be either 'mock' or 'openai'.");
};

export const getConfig = (): AppConfig => {
  const classifierMode = readClassifierMode();
  const openAiApiKey = process.env.OPENAI_API_KEY;

  if (classifierMode === "openai" && !openAiApiKey) {
    throw new Error("OPENAI_API_KEY is required when LEGAL_CLASSIFIER=openai.");
  }

  const openAiTimeoutMs = Number(process.env.OPENAI_TIMEOUT_MS ?? 10_000);
  if (!Number.isInteger(openAiTimeoutMs) || openAiTimeoutMs < 1 || openAiTimeoutMs > 60_000) {
    throw new Error("OPENAI_TIMEOUT_MS must be an integer between 1 and 60000.");
  }

  return {
    classifierMode,
    openAiApiKey,
    openAiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    openAiTimeoutMs
  };
};
