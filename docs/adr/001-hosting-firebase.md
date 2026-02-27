# ADR-001: Stay on Firebase for Hosting

## Status

Accepted

## Date

2026-02-26

## Context

With the introduction of a dedicated API service (#10), we needed to evaluate hosting options. The primary candidates were:

- **Option A:** Firebase Hosting + Cloud Functions v2
- **Option B:** AWS (Lambda + API Gateway + S3 + CloudFront)

See issue #11 for the full evaluation.

## Decision

**Stay on Firebase** with Cloud Functions v2 for the API service.

## Rationale

1. **Already in the Firebase ecosystem** — Auth and Firestore are Firebase services. Staying avoids cross-service auth complexity.
2. **API is portable** — Hono runs on any runtime (Cloud Functions, Lambda, Workers, bare metal), so migration is straightforward if needed later.
3. **Operational simplicity** — `firebase deploy` handles everything. No VPCs, IAM policies, or CDK stacks to maintain.
4. **Appropriate for project scale** — AWS infrastructure overhead is not justified for a small project.
5. **Cold starts are manageable** — Cloud Functions v2 supports `minInstances` for critical paths.

## Trade-offs

- SSE has a 30-minute timeout on Cloud Functions v2 (acceptable for our use case)
- Deeper vendor lock-in to Google Cloud (mitigated by portable API layer)
- No native WebSocket support (SSE is sufficient for now)

## Consequences

- API service will target Cloud Functions v2 / Cloud Run as deployment target
- Client remains on Firebase Hosting (static SPA with global CDN)
- If we need WebSockets in the future, evaluate Cloudflare Workers or Fly.io at that point
