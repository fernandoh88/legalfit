import cors from "cors";
import express from "express";
import helmet from "helmet";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { errorHandler } from "./middleware/errorHandler.js";
import { healthRouter } from "./routes/health.js";
import { intakeRouter } from "./routes/intake.js";
import { lawyersRouter } from "./routes/lawyers.js";
import { matchesRouter } from "./routes/matches.js";

interface AppOptions {
  clientDist?: string;
}

export const createApp = (options: AppOptions = {}) => {
  const app = express();
  const clientOrigin = process.env.CLIENT_ORIGIN ?? process.env.CLIENT_URL ?? "http://localhost:5173";
  const proxyHops = Number(process.env.TRUST_PROXY_HOPS ?? 0);
  if (!Number.isInteger(proxyHops) || proxyHops < 0) {
    throw new Error("TRUST_PROXY_HOPS must be a non-negative integer.");
  }
  app.set("trust proxy", proxyHops);

  app.use(helmet());
  app.use(cors({ origin: clientOrigin }));
  app.use(express.json({ limit: "16kb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/intake", intakeRouter);
  app.use("/api/matches", matchesRouter);
  app.use("/api/lawyers", lawyersRouter);

  // API errors must never return the frontend HTML fallback.
  app.use("/api", (_req, res) => {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found" } });
  });

  const clientDist = options.clientDist ??
    (process.env.NODE_ENV === "production"
      ? fileURLToPath(new URL("../../client/dist/", import.meta.url))
      : undefined);

  if (clientDist) {
    if (!existsSync(path.join(clientDist, "index.html"))) {
      throw new Error("Frontend build is missing. Run npm run build before npm start.");
    }
    app.use(express.static(clientDist));
    app.get(["/", "/intake", "/results", "/lawyers/:id"], (_req, res) => {
      res.sendFile(path.join(clientDist, "index.html"));
    });
  }

  app.use((_req, res) => {
    res.status(404).json({ error: { message: "Route not found" } });
  });

  app.use(errorHandler);

  return app;
};
