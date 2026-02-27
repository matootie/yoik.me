# yoik.me — Issue Resolution Work Log

**Date:** February 26–27, 2026  
**Author:** Hal (halheinemann)  
**Repository:** matootie/yoik.me

---

## Issue #9 — Update all dependencies to latest versions

**Analysis:** PR #15 already existed with comprehensive dependency updates (React 18→19, Vite 4→7, Tailwind 3→4, Firebase 10→12, etc.). The PR had merge conflicts due to trunk receiving the Bun migration (#14) after the branch was created.

**Approach:** Rebased the branch onto trunk (the Bun migration commit was auto-skipped as already applied), verified TypeScript compilation, force-pushed, and merged.

**Changes:** 16 files modified — package.json updates, Tailwind v4 migration (removed postcss.config.js, tailwind.config.js), Turbo v2 config, HeadlessUI v2 component migration, moment.js → dayjs.

**PR:** #15 — merged (squash)  
**Also:** Closed superseded dependabot PRs #1, #5, #6.

---

## Issue #2 — Mobile view on iOS messes with scrolling

**Analysis:** The home page used `h-screen` (CSS `100vh`) which on iOS Safari includes the area behind the browser chrome (address bar/toolbar), causing the page to overflow the visible viewport.

**Approach:** Replaced `h-screen` with `h-dvh` (CSS `100dvh` — dynamic viewport height), which adjusts to the actual visible area on mobile browsers.

**Changes:** `services/client/src/pages/home.tsx` — 1 class name change.

**PR:** #16 — merged (squash)

---

## Issue #3 — Multiple tabs clears identity

**Analysis:** In `auth.tsx`, `setPersistence(auth, browserLocalPersistence)` was called without `await` before `signInAnonymously()`. This race condition meant the anonymous identity could be created with wrong persistence, causing identity loss across tabs.

**Approach:** Added `await` to the `setPersistence` call.

**Changes:** `services/client/src/utils/auth.tsx` — 1 line change.

**PR:** #17 — merged (squash)

---

## Issue #4 — Infinite scrolling broken if items fit within screen height

**Analysis:** The infinite scroll relied entirely on an `onScroll` event handler. If the first page of posts fit within the viewport, no scrollbar appeared, no scroll events fired, and `fetchNextPage` was never called.

**Approach:** Added a `useEffect` that runs after data loads to check if `scrollHeight <= clientHeight`. If so, it triggers `fetchNextPage()` automatically until the viewport overflows or there are no more pages.

**Changes:** `services/client/src/components/posts/posts-list.tsx` — added useEffect with viewport-fit detection.

**PR:** #18 — merged (squash)

---

## Issue #11 — Hosting evaluation: Firebase vs AWS

**Analysis:** Discussion issue with a detailed evaluation already written in the issue body. The recommendation was to stay on Firebase.

**Approach:** Created an Architecture Decision Record (ADR) documenting the decision to stay on Firebase with Cloud Functions v2, based on the analysis in the issue.

**Changes:** `docs/adr/001-hosting-firebase.md` — new ADR document.

**PR:** #19 — merged (squash)

---

## Issue #10 — Create dedicated API service

**Analysis:** The client was directly accessing Firestore from the browser using the Firebase client SDK. This needed to be extracted into a server-side API for security, testability, and backend flexibility.

**Approach:** Created a complete Hono API service with Firebase Admin SDK, implemented all required endpoints, updated the client to use fetch-based API calls instead of direct Firestore access, and introduced SSE for real-time updates.

**Changes:**
- **New:** `services/api/` — Hono API service with routes for posts and comments (CRUD + SSE)
- **New:** `packages/types/` — shared TypeScript types for API contracts
- **New:** `services/client/src/utils/api.ts` — thin API client with auth token injection
- **Modified:** `services/client/src/utils/data/` — replaced all Firestore calls with API calls
- **Modified:** `services/client/src/utils/firebase.tsx` — removed Firestore, auth-only

**Endpoints:**
- `POST /api/posts` (authenticated)
- `GET /api/posts` (paginated)
- `GET /api/posts/:id`
- `GET /api/posts/live` (SSE)
- `POST /api/posts/:postId/comments` (authenticated)
- `GET /api/posts/:postId/comments` (paginated)
- `GET /api/posts/:postId/comments/live` (SSE)

**PR:** #20 — merged (squash)

---

## Issue #13 — Add test coverage with Vitest

**Analysis:** No test infrastructure existed. Needed to add Vitest across the monorepo.

**Approach:** Added Vitest to all three packages with appropriate configurations. Client uses jsdom environment for future React component tests. Tests run in parallel via Turbo.

**Changes:**
- `@yme/types`: 3 tests (type structural validation)
- `@yme/api`: 7 tests (getName/getColor determinism, format, uniqueness)
- `@yme/client`: 5 tests (getName/getColor)
- Vitest config, turbo test task, package.json scripts

**Total tests:** 15 (all passing)

**PR:** #21 — merged (squash)

---

## Issue #12 — Set up CI/CD with GitHub Actions

**Analysis:** No CI/CD pipeline existed.

**Approach:** Created a GitHub Actions workflow that runs on pushes to trunk and on pull requests with: Bun setup, dependency install, TypeScript type checking, test suite, and Prettier format checking.

**Changes:** `.github/workflows/ci.yml` — new CI workflow.

**PR:** #22 — merged (squash)

---

## Summary

| Issue | Title | Status | PR |
|-------|-------|--------|-----|
| #2 | iOS scrolling | ✅ Merged | #16 |
| #3 | Multiple tabs identity | ✅ Merged | #17 |
| #4 | Infinite scroll viewport | ✅ Merged | #18 |
| #9 | Update dependencies | ✅ Merged | #15 |
| #10 | API service | ✅ Merged | #20 |
| #11 | Hosting evaluation | ✅ Merged | #19 |
| #12 | CI/CD | ✅ Merged | #22 |
| #13 | Test coverage | ✅ Merged | #21 |

**All 8 issues resolved. 0 open issues remaining.**
