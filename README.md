# LegalFit

LegalFit is a full-stack portfolio project for Canadian lawyer discovery. It helps people describe a legal problem and discover fictional British Columbia lawyers whose demo experience appears relevant.

LegalFit does not provide legal advice, does not assess whether a person has a valid legal claim, does not calculate lawyer win rates, and does not predict case outcomes.

## MVP Scope

- British Columbia, Canada only
- Fictional lawyers only
- Fictional demo case metadata only
- Deterministic mock classification by default; optional backend OpenAI classification
- Transparent deterministic lawyer matching
- Public portfolio deployment requires no API key or database
- No court database, CanLII, or Law Society scraping

## Architecture

The project uses npm workspaces:

- `client`: React, Vite, TypeScript, React Router, responsive CSS
- `server`: Node.js, Express, TypeScript, Mongoose models, Zod validation, Vitest, Supertest

The backend keeps domain logic out of route handlers:

- `LegalClassifier` is an interface implemented by `MockLegalClassifier` and `OpenAILegalClassifier`.
- `LawyerMatchingService` scores fictional lawyers against the classification and intake.
- Route modules handle validation, HTTP shape, and response status codes.
- Central middleware handles errors and security concerns.

## Matching

The current `Experience Match` score is deterministic and explainable. It combines:

- Practice area alignment
- Overlap between classified issues and demo case issues
- Province and city compatibility
- Volume of relevant fictional demo experience

Years practising are displayed but are not a dominant ranking factor.

The score means similarity between the user's legal issue and the lawyer's represented demo experience. It is not a quality rating, win probability, endorsement, or prediction.

## Install

```bash
npm ci
```

## Environment

Copy `.env.example` to `.env` for local server configuration.

Configuration (defaults work for a local demo):

- `PORT`: API port, defaults to `4000`
- `CLIENT_ORIGIN`: allowed browser origin for CORS
- `CLIENT_URL`: alternative to `CLIENT_ORIGIN`; unnecessary for a same-origin production demo
- `MONGODB_URI`: MongoDB connection string reserved for future persistence
- `RATE_LIMIT_WINDOW_MS`: rate limit window for intake classification
- `RATE_LIMIT_MAX`: max intake classification requests per window
- `LEGAL_CLASSIFIER`: `mock` (default) or `openai`
- `OPENAI_API_KEY`: required only in OpenAI mode; server-side secret
- `OPENAI_MODEL`: centralized model setting, default `gpt-4.1-mini`
- `OPENAI_TIMEOUT_MS`: classification deadline, default `10000`
- `NODE_ENV`: set to `production` to serve the built frontend
- `TRUST_PROXY_HOPS`: defaults to `0`; use `1` only behind a trusted single-hop proxy such as Render

This MVP serves seeded in-memory fictional demo data and does not require MongoDB to run.

## Development

Start both processes with `npm run dev`, or run them separately in two terminals as below. The server watches TypeScript changes directly.

Run the backend:

```bash
npm run dev:server
```

Run the frontend:

```bash
npm run dev:client
```

Open the Vite URL, typically `http://localhost:5173`.

## Tests And Checks

```bash
npm test
npm run typecheck
npm run build
```

## API

- `GET /api/health`
- `POST /api/intake/classify`
- `POST /api/matches`
- `GET /api/lawyers`
- `GET /api/lawyers/:id`
- `GET /api/lawyers/:id/cases`

## AI Classification

The Express backend uses the official OpenAI Node.js SDK and Responses API with a strict JSON Schema. The schema constrains the area of law, issues, user role, urgency, missing-information flag, up to three follow-up questions, and a short neutral summary. Responses are validated with Zod before returning them to the frontend.

Only the legal-problem description is sent with the routing instructions. Lawyers, cases, city, province, account details, and user identifiers are not sent. Requests set `store: false`; this disables response storage but does not replace OpenAI's applicable data-handling policies. Avoid entering sensitive personal information in the portfolio demo.

The classifier identifies general issue categories to support lawyer discovery. It does not give legal advice, assess claim validity, recommend strategy, calculate damages, predict outcomes, recommend a best lawyer, or generate lawyers. Validated intake location remains authoritative.

To enable AI locally, set `LEGAL_CLASSIFIER=openai` and `OPENAI_API_KEY` in the root `.env`, optionally set `OPENAI_MODEL`, then restart the backend. On a host, set these variables in its secret environment settings. Never use a `VITE_` variable for an API key. Switch back using `LEGAL_CLASSIFIER=mock`. Missing keys cause a startup error; upstream failures and timeouts return a clean 503 error without a silent mock fallback. Automated tests use mocked responses and never call OpenAI.

## Production And Portfolio Deployment

Frontend and API run together in one Express process. The browser uses relative `/api` URLs, so no separate API URL or CORS setup is needed. React routes support direct links and refreshes. GitHub Pages alone cannot run this Express backend.

Use Node.js 22 and npm. Build and start locally:

```bash
npm ci
npm run build
```

PowerShell:

```powershell
$env:NODE_ENV = "production"
$env:LEGAL_CLASSIFIER = "mock"
npm start
```

macOS/Linux:

```bash
NODE_ENV=production LEGAL_CLASSIFIER=mock npm start
```

Open `http://localhost:4000`. Verify `/api/health`, `/intake`, and a complete intake-to-profile flow. No MongoDB or API key is required. The demo uses in-memory seed data and stores no intake records.

### Docker

```bash
docker build -t legalfit .
docker run --rm -p 4000:4000 --name legalfit legalfit
```

The multi-stage image includes compiled frontend/backend files and backend production dependencies. It runs as a non-root user, includes a health check, and excludes local secrets. Pass production environment variables at runtime, not during image builds.

### GitHub And Render

1. Create an empty GitHub repository and push this project, including `package-lock.json`. Exclude `.env` and build artifacts using the supplied `.gitignore`.
2. In Render, create a new Blueprint and connect that repository. Render reads the root `render.yaml` and builds the Dockerfile.
3. Keep `LEGAL_CLASSIFIER=mock` for the public demo. The blueprint explicitly selects the free plan and configures `/api/health`.
4. Once deployment succeeds, open the assigned URL and test intake, results, profile navigation, and refreshing `/intake`.
5. Add the deployed URL to the GitHub repository's About website field and your portfolio. Add real screenshots to the README after the demo is running.

No deployment or GitHub push is performed by these files. Hosting availability and free-plan limits depend on the provider. See [Render Blueprint documentation](https://render.com/docs/blueprint-spec).

GitHub Actions runs install, tests, typecheck, build, and a Docker build on pushes and pull requests. The production start command is `npm start` after `npm run build`; it binds to `0.0.0.0` and honors the host's `PORT`.

### Dependency Audit

Compatible Express/qs updates were applied to address the production audit findings. The backend production dependency audit reports zero vulnerabilities at the time of this check. No force upgrades have been applied.

| Package | Use | Severity | Compatible fix | Action |
| --- | --- | --- | --- | --- |
| Express / qs | Production | Moderate (resolved) | Yes | Compatible updates applied |
| Vitest | Development | Critical | No within Vitest 2 | Plan and test a major upgrade |
| Nested Vite via Vitest | Development | High | No complete fix within the current test stack | Upgrade alongside Vitest |
| @vitest/mocker | Development | Moderate | No within Vitest 2 | Upgrade alongside Vitest |
| vite-node | Development | Moderate | No complete fix within Vitest 2 | Upgrade alongside Vitest |
| Nested esbuild | Development | Moderate | No complete fix within the current test stack | Upgrade alongside Vitest |

Do not expose test/dev servers publicly. They are excluded from the runtime Docker image. Run `npm audit` to inspect current findings. The client build's Vite version is already patched; the remaining Vite findings are in the older test stack.

## Future Legal Data Integration

Future ingestion should only use authorized/public legal-data sources in compliance with site terms, privacy requirements, and applicable Canadian law. Real lawyer identity and case linkage should be verified before display.

## Legal And Compliance Considerations

- Avoid legal advice and outcome predictions.
- Avoid claims that any lawyer is the best.
- Avoid win-rate calculations.
- Clearly distinguish lawyer discovery from legal services.
- Clearly mark demo data as fictional.
- Verify lawyer identity and public case links before using real data.

## Roadmap

Phase 1: Demo lawyer matching

Phase 2: OpenAI structured legal classification

Phase 3: Authorized/public legal-data ingestion

Phase 4: Lawyer identity verification

Phase 5: Semantic similarity between client problems and historical cases
