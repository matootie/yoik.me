# End-to-End Tests

Functional API tests for yoik.me. These tests make real HTTP requests against
a running API instance, making them suitable for pre- and post-deployment
verification.

## How it works

In CI, tests run against **Firebase emulators** (functions + firestore +
hosting), not production. The hosting emulator applies the same rewrite rules as
production (`/api/**` → Cloud Function), so the test suite hits identical URL
paths without touching real infrastructure. Firestore is completely isolated per
run — the emulator starts with an empty database every time.

The hosting preview channel deploy still runs (for visual review by PR
reviewers) but the e2e test suite does **not** depend on it.

## Quick start

```bash
# From the repo root — run against local dev server (localhost:3001):
bun run test:e2e

# Run against local emulators (start emulators first):
bunx firebase-tools emulators:start --only functions,firestore,hosting --project yoikme
E2E_BASE_URL=http://localhost:5000 bun run test:e2e

# Run against production:
bun run test:e2e:production
```

## Configuration

| Variable       | Description                       | Default                 |
| -------------- | --------------------------------- | ----------------------- |
| `E2E_BASE_URL` | API base URL to test against      | `http://localhost:3001` |

### Firebase emulator ports (configured in `firebase.json`)

| Emulator  | Port |
| --------- | ---- |
| Hosting   | 5000 |
| Functions | 5001 |
| Firestore | 8080 |

## What's tested

- **Health check** — API reachability and basic response.
- **Posts** — Listing, pagination, single-post retrieval, creation (auth), validation.
- **Comments** — Listing, creation (auth), validation, error handling.
- **CORS & HTTP edge cases** — Preflight requests, malformed bodies, unexpected
  content types (addresses issues like #33 where POST requests returned 502).

## Test design

Tests are designed to run against **any environment** (emulators, local dev,
production) without setup or teardown. Read-only tests always run; write tests
are gated behind `E2E_AUTH_TOKEN` and are automatically skipped when it's not
set. With the emulator's empty database, read-only tests gracefully handle empty
result sets (pagination, schema checks guard on `items.length > 0`).
