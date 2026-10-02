import { describe, expect, it, vi } from "vitest";
import { getConfig } from "../config.js";
import { getCases, getLawyers } from "../repositories/demoRepository.js";
import { LawyerMatchingService } from "../services/LawyerMatchingService.js";
import { MockLegalClassifier } from "../services/MockLegalClassifier.js";
import { ClassificationUnavailableError, OpenAILegalClassifier } from "../services/OpenAILegalClassifier.js";

const responseWith = (body: unknown) => ({
  output_text: JSON.stringify(body)
});

describe("Legal classifiers", () => {
  it("maps a valid OpenAI structured response correctly", async () => {
    const client = {
      create: vi.fn().mockResolvedValue(
        responseWith({
          primaryArea: "employment",
          issues: ["wrongful dismissal", "severance", "reasonable notice"],
          userRole: "employee",
          urgency: "normal",
          needsMoreInformation: false,
          followUpQuestions: [],
          summary: "Employment termination involving severance and notice concerns."
        })
      )
    };

    const classifier = new OpenAILegalClassifier(client, "test-model", 1000);
    const result = await classifier.classifyLegalProblem(
      "I worked for my employer for seven years and was fired with only two weeks of severance."
    );

    expect(result.primaryArea).toBe("employment");
    expect(result.issues).toContain("severance");
    expect(client.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "test-model",
        store: false,
        text: expect.objectContaining({
          format: expect.objectContaining({ type: "json_schema", strict: true })
        })
      }),
      expect.objectContaining({ timeout: 1000, maxRetries: 0, signal: expect.any(AbortSignal) })
    );
  });

  it("classifies an employment scenario in mock mode", async () => {
    const classifier = new MockLegalClassifier();
    const result = await classifier.classifyLegalProblem(
      "I worked for my employer for seven years and was fired with only two weeks of severance."
    );

    expect(result.primaryArea).toBe("employment");
    expect(result.issues).toEqual(
      expect.arrayContaining(["wrongful dismissal", "severance", "reasonable notice"])
    );
  });

  it("handles a family scenario needing more information from OpenAI", async () => {
    const client = {
      create: vi.fn().mockResolvedValue(
        responseWith({
          primaryArea: "family",
          issues: ["property division"],
          userRole: "spouse",
          urgency: "normal",
          needsMoreInformation: true,
          followUpQuestions: [
            "Are you married or common-law?",
            "Are you currently separated?",
            "Are children involved?"
          ],
          summary: "Family matter involving property division concerns."
        })
      )
    };

    const classifier = new OpenAILegalClassifier(client, "test-model", 1000);
    const result = await classifier.classifyLegalProblem("My wife is trying to take everything.");

    expect(result.primaryArea).toBe("family");
    expect(result.needsMoreInformation).toBe(true);
    expect(result.followUpQuestions).toHaveLength(3);
  });

  it("classifies a landlord tenant scenario in mock mode", async () => {
    const classifier = new MockLegalClassifier();
    const result = await classifier.classifyLegalProblem(
      "My landlord kept my deposit and the rent dispute is still unresolved."
    );

    expect(result.primaryArea).toBe("landlord-tenant");
    expect(result.issues).toContain("tenancy dispute");
  });

  it("maps a landlord tenant scenario from OpenAI", async () => {
    const classifier = new OpenAILegalClassifier(
      { create: vi.fn().mockResolvedValue(responseWith({
        primaryArea: "landlord-tenant",
        issues: ["tenancy dispute", "security deposit"],
        userRole: "tenant",
        urgency: "normal",
        needsMoreInformation: false,
        followUpQuestions: [],
        summary: "Rental tenancy involving a disputed security deposit."
      })) },
      "test-model",
      1000
    );
    const result = await classifier.classifyLegalProblem("My landlord kept my damage deposit.");
    expect(result.primaryArea).toBe("landlord-tenant");
    expect(result.issues).toContain("security deposit");
  });

  it("returns a clean error on OpenAI API failure", async () => {
    const classifier = new OpenAILegalClassifier(
      { create: vi.fn().mockRejectedValue(new Error("upstream failed")) },
      "test-model",
      1000
    );

    await expect(classifier.classifyLegalProblem("I was fired from work.")).rejects.toBeInstanceOf(
      ClassificationUnavailableError
    );
  });

  it("returns a clean error on OpenAI timeout", async () => {
    const create = vi.fn((_params: unknown, _options?: { signal?: AbortSignal }) =>
      new Promise<{ output_text?: string }>(() => undefined));
    const classifier = new OpenAILegalClassifier(
      { create },
      "test-model",
      5
    );

    await expect(classifier.classifyLegalProblem("I was fired from work.")).rejects.toBeInstanceOf(
      ClassificationUnavailableError
    );
    expect(create.mock.calls[0][1]?.signal?.aborted).toBe(true);
  });

  it("returns a clean error on invalid AI response", async () => {
    const classifier = new OpenAILegalClassifier(
      {
        create: vi.fn().mockResolvedValue(
          responseWith({
            primaryArea: "not-a-supported-area",
            issues: [],
            userRole: "",
            urgency: "soon",
            needsMoreInformation: false,
            followUpQuestions: [],
            summary: "Invalid."
          })
        )
      },
      "test-model",
      1000
    );

    await expect(classifier.classifyLegalProblem("I was fired from work.")).rejects.toBeInstanceOf(
      ClassificationUnavailableError
    );
  });

  it("requires OPENAI_API_KEY when OpenAI mode is enabled", () => {
    const previousMode = process.env.LEGAL_CLASSIFIER;
    const previousKey = process.env.OPENAI_API_KEY;
    process.env.LEGAL_CLASSIFIER = "openai";
    delete process.env.OPENAI_API_KEY;

    expect(() => getConfig()).toThrow("OPENAI_API_KEY is required");

    if (previousMode === undefined) delete process.env.LEGAL_CLASSIFIER;
    else process.env.LEGAL_CLASSIFIER = previousMode;

    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  });

  it("matches lawyers using classifications produced by OpenAILegalClassifier", async () => {
    const classifier = new OpenAILegalClassifier(
      {
        create: vi.fn().mockResolvedValue(
          responseWith({
            primaryArea: "employment",
            issues: ["wrongful dismissal", "severance", "reasonable notice"],
            userRole: "employee",
            urgency: "normal",
            needsMoreInformation: false,
            followUpQuestions: [],
            summary: "Employment termination involving severance and notice concerns."
          })
        )
      },
      "test-model",
      1000
    );
    const classification = await classifier.classifyLegalProblem("I was fired with severance.");
    const matches = new LawyerMatchingService(getLawyers(), getCases()).findMatches(
      {
        description: "I was fired with severance.",
        city: "Vancouver",
        province: "BC"
      },
      classification
    );

    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].lawyer.practiceAreas).toContain("Employment Law");
  });
});
