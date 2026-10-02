import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../app.js";

const app = createApp();

describe("LegalFit API", () => {
  it("returns health status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("classifies an employment scenario", async () => {
    const response = await request(app).post("/api/intake/classify").send({
      description:
        "I worked for my employer for seven years. I was recently terminated and received only two weeks of severance.",
      city: "Burnaby",
      province: "BC"
    });

    expect(response.status).toBe(200);
    expect(response.body.classification.primaryArea).toBe("employment");
    expect(response.body.classification.issues).toContain("severance");
  });

  it("classifies a landlord scenario", async () => {
    const response = await request(app).post("/api/intake/classify").send({
      description:
        "My landlord kept my damage deposit and has not fixed major repairs in my rental apartment.",
      city: "Vancouver",
      province: "BC"
    });

    expect(response.status).toBe(200);
    expect(response.body.classification.primaryArea).toBe("landlord-tenant");
    expect(response.body.classification.issues).toContain("tenancy dispute");
  });

  it("rejects invalid intake", async () => {
    const response = await request(app).post("/api/intake/classify").send({
      description: "Too short",
      city: "Burnaby",
      province: "AB"
    });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe("Invalid request");
  });

  it("returns ranked lawyer matches", async () => {
    const classifyResponse = await request(app).post("/api/intake/classify").send({
      description:
        "I was fired after years at work and need to understand severance and reasonable notice.",
      city: "Vancouver",
      province: "BC"
    });

    const response = await request(app)
      .post("/api/matches")
      .send({
        intake: classifyResponse.body.intake,
        classification: classifyResponse.body.classification
      });

    expect(response.status).toBe(200);
    expect(response.body.matches.length).toBeGreaterThan(0);
    expect(response.body.matches[0].lawyer.practiceAreas).toContain("Employment Law");
    expect(response.body.matches[0].experienceMatch).toBeGreaterThan(70);
  });

  it("looks up a lawyer and their cases", async () => {
    const lawyerResponse = await request(app).get("/api/lawyers/ava-chen");
    const caseResponse = await request(app).get("/api/lawyers/ava-chen/cases");

    expect(lawyerResponse.status).toBe(200);
    expect(lawyerResponse.body.lawyer.name).toBe("Ava Chen");
    expect(caseResponse.status).toBe(200);
    expect(caseResponse.body.cases.length).toBeGreaterThan(0);
    expect(caseResponse.body.cases[0].isDemo).toBe(true);
  });
});
