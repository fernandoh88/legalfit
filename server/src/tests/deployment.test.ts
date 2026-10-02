import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../app.js";

const directory = mkdtempSync(path.join(tmpdir(), "legalfit-test-"));
writeFileSync(path.join(directory, "index.html"), '<!doctype html><div id="root">LegalFit</div>');
writeFileSync(path.join(directory, "asset.js"), 'console.log("LegalFit");');
const app = createApp({ clientDist: directory });

afterAll(() => rmSync(directory, { recursive: true, force: true }));

describe("Production hosting", () => {
  it.each(["/", "/intake", "/results", "/lawyers/ava-chen"])("serves SPA links at %s", async (route) => {
    const response = await request(app).get(route);
    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).toContain('id="root"');
  });

  it("serves frontend assets and security headers", async () => {
    const response = await request(app).get("/asset.js");
    expect(response.status).toBe(200);
    expect(response.text).toContain("LegalFit");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("keeps API 404 responses as JSON", async () => {
    const response = await request(app).get("/api/unknown");
    expect(response.status).toBe(404);
    expect(response.type).toBe("application/json");
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  it("keeps health checks available alongside the frontend", async () => {
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("fails clearly when the frontend build is missing", () => {
    expect(() => createApp({ clientDist: path.join(directory, "missing") })).toThrow("Frontend build is missing");
  });
});
