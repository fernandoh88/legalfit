import OpenAI from "openai";
import type { ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses";
import { aiClassificationSchema } from "../schemas.js";
import type { LegalClassification } from "../types.js";
import { ApiError } from "../middleware/errorHandler.js";
import type { LegalClassifier } from "./LegalClassifier.js";

interface ClassificationResponse {
  output_text?: string;
}

interface ResponsesClient {
  create(params: ResponseCreateParamsNonStreaming, options?: OpenAI.RequestOptions): PromiseLike<ClassificationResponse>;
}

export const legalClassificationJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primaryArea: {
      type: "string",
      enum: [
        "employment",
        "family",
        "criminal",
        "immigration",
        "personal-injury",
        "real-estate",
        "business",
        "civil-litigation",
        "landlord-tenant",
        "wills-estates",
        "human-rights",
        "other"
      ]
    },
    issues: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: { type: "string", minLength: 2, maxLength: 80 }
    },
    userRole: { type: "string", minLength: 2, maxLength: 80 },
    urgency: { type: "string", enum: ["low", "normal", "high", "emergency"] },
    needsMoreInformation: { type: "boolean" },
    followUpQuestions: {
      type: "array",
      maxItems: 3,
      items: { type: "string", minLength: 5, maxLength: 160 }
    },
    summary: { type: "string", minLength: 5, maxLength: 220 }
  },
  required: [
    "primaryArea",
    "issues",
    "userRole",
    "urgency",
    "needsMoreInformation",
    "followUpQuestions",
    "summary"
  ]
} as const;

const classifierInstructions = [
  "You are LegalFit's legal-issue classifier for lawyer discovery in British Columbia, Canada.",
  "Behave only as an information-routing system. Do not provide legal advice.",
  "Determine the most likely general area of law, extract issue categories, identify the user's general role when reasonably clear, identify missing information, and flag urgency.",
  "Do not state that a law was violated, that the user has a valid claim, that the user will win, or that any outcome is likely.",
  "Do not recommend legal strategy, calculate damages, or recommend any lawyer.",
  "Do not invent facts. If important facts are unclear, set needsMoreInformation to true and ask up to three concise follow-up questions.",
  "The user's selected province is authoritative and is handled by the application. Do not infer or change jurisdiction.",
  "Use short neutral summaries that describe what the user reported, not legal conclusions."
].join(" ");

export class ClassificationUnavailableError extends ApiError {
  constructor() {
    super(503, "We couldn't analyze your description right now.", "CLASSIFICATION_UNAVAILABLE");
  }
}

export class OpenAILegalClassifier implements LegalClassifier {
  constructor(
    private readonly client: ResponsesClient,
    private readonly model: string,
    private readonly timeoutMs: number
  ) {}

  async classifyLegalProblem(description: string): Promise<LegalClassification> {
    const controller = new AbortController();
    try {
      const response = await this.withTimeout(
        this.client.create({
          model: this.model,
          instructions: classifierInstructions,
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: `Classify this legal-problem description for lawyer discovery only:\n\n${description}`
                }
              ]
            }
          ],
          store: false,
          text: {
            format: {
              type: "json_schema",
              name: "legal_classification",
              strict: true,
              schema: legalClassificationJsonSchema
            }
          }
        }, { signal: controller.signal, timeout: this.timeoutMs, maxRetries: 0 }),
        this.timeoutMs,
        controller
      );

      const outputText = response.output_text;
      if (!outputText) {
        throw new ClassificationUnavailableError();
      }

      return aiClassificationSchema.parse(JSON.parse(outputText));
    } catch (error) {
      if (error instanceof ClassificationUnavailableError) {
        throw error;
      }

      throw new ClassificationUnavailableError();
    }
  }

  private async withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number, controller: AbortController): Promise<T> {
    let timeout: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_resolve, reject) => {
      timeout = setTimeout(() => {
        controller.abort();
        reject(new ClassificationUnavailableError());
      }, timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }
}

export const createOpenAIResponsesClient = (apiKey: string): ResponsesClient => {
  const openai = new OpenAI({ apiKey });
  return openai.responses;
};
