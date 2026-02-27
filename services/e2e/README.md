# End-to-End Tests

Functional API tests for yoik.me. These tests make real HTTP requests against
a running API instance, making them suitable for pre- and post-deployment
verification.

## Quick start

```bash
# From the repo root — run against local dev server (localhost:3001):
bun run test:e2e

# Run against production:
bun run test:e2e:production
```

## Configuration

| Variable         | Description                       | Default                 |
| ---------------- | --------------------------------- | ----------------------- |
| `E2E_BASE_URL`   | API base URL to test against      | `http://localhost:3001` |
| `E2E_AUTH_TOKEN` | Firebase ID token for write tests | _(unset — skips write)_ |

### Getting an auth token

Write tests (creating posts/comments) require a valid Firebase ID token. You
can obtain one from the browser dev tools after logging in to the app:

1. Open the app and sign in.
2. In the browser console: `await firebase.auth().currentUser.getIdToken()`
3. Export it: `export E2E_AUTH_TOKEN="<token>"`

**Note:** Firebase ID tokens expire after 1 hour.

## What's tested

- **Health check** — API reachability and basic response.
- **Posts** — Listing, pagination, single-post retrieval, creation (auth), validation.
- **Comments** — Listing, creation (auth), validation, error handling.
- **CORS & HTTP edge cases** — Preflight requests, malformed bodies, unexpected
  content types (addresses issues like #33 where POST requests returned 502).

## Test design

Tests are designed to run against **any environment** (local, staging, production)
without setup or teardown. Read-only tests always run; write tests are gated
behind `E2E_AUTH_TOKEN` and are automatically skipped when it's not set.
