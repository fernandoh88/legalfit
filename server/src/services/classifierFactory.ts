import { getConfig } from "../config.js";
import type { LegalClassifier } from "./LegalClassifier.js";
import { MockLegalClassifier } from "./MockLegalClassifier.js";
import { createOpenAIResponsesClient, OpenAILegalClassifier } from "./OpenAILegalClassifier.js";

export const createLegalClassifier = (): LegalClassifier => {
  const config = getConfig();

  if (config.classifierMode === "mock") {
    return new MockLegalClassifier();
  }

  return new OpenAILegalClassifier(
    createOpenAIResponsesClient(config.openAiApiKey!),
    config.openAiModel,
    config.openAiTimeoutMs
  );
};
