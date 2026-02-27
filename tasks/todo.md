# Licitor Implementation TODO

## Usage
- Update this file continuously during implementation.
- Keep phase status aligned with `tasks/spec.md`.
- Mark items complete only after code + tests + lint/build pass.

## Global Checklist (applies to every phase)
- [x] Implement feature code
- [x] Add/update unit tests
- [x] Add/update integration tests
- [ ] Confirm coverage >= 80% for modified/new modules
- [x] Run `npm run lint`
- [x] Run `npm run build`
- [x] Run `npm run test:unit`
- [x] Run `npm run test:integration`
- [x] Update docs and phase status

## Phase 0 - Foundation and Tooling
Status: Accepted
- [x] Step 1 (prereq for all below): Canonicalize source layout and imports
  - [x] Move route files into `src/app/(auth)` and `src/app/(main)` groups
  - [x] Remove duplicate non-grouped route files for the same endpoints
  - [x] Canonicalize DB module paths to `src/lib/db/*` and `@/lib/db/*`
  - [x] Canonicalize validator module paths to `src/lib/validators/*` and `@/lib/validators/*`
- [x] Step 2 (depends on Step 1): Scaffold/verify required folders
  - [x] `src/app/api/{auth/[...all],cloudinary}`
  - [x] `src/components/{ui,auth,listings,bidding,dashboard,shared}`
  - [x] `src/lib/{db,validators,ai}` + `src/hooks` + `src/server/{actions,queries}` + `src/types`
- [x] Step 3 (depends on Step 1): Implement test architecture under `test/`
  - [x] Add `test/setup.unit.ts`
  - [x] Add `test/setup.integration.ts`
  - [x] Add `test/global-setup.integration.ts`
  - [x] Add `test/helpers/transactions.ts` for per-test rollback harness
  - [x] Add `test/helpers/database.ts` fallback deterministic reset utility
  - [x] Update Vitest configs to wire setup + global setup
- [x] Step 4 (depends on Step 3): Add baseline fixtures and mocks
  - [x] Add fixtures factory module in `test/fixtures/factories.ts`
  - [x] Add MSW handlers in `test/mocks/handlers.ts`
  - [x] Add fixture usage example in integration tests
  - [x] Add MSW usage example in unit tests
- [x] Step 5 (depends on Steps 1-4): Validate quality gates
  - [x] `npm run lint`
  - [x] `npm run build`
  - [x] `npm run test:unit`
  - [x] `npm run test:integration`
- [x] Step 6 (depends on Steps 1-5): Update planning docs
  - [x] Update `tasks/spec.md` Phase 0 requirements and canonical architecture notes
  - [x] Update this `tasks/todo.md` with ordered implementation status

## Phase 1 - Listing Creation and Management
Status: In Progress
- [ ] Extend Drizzle schema for auction listing model
- [ ] Create migration + seed updates
- [ ] Add Zod schemas for listing create/update inputs
- [ ] Build create listing page/form with React Hook Form
- [ ] Implement image upload path/storage abstraction
- [ ] Add create listing server action
- [ ] Add edit listing server action (owner only)
- [ ] Add cancel listing server action (owner only)
- [ ] Build listing detail page for auction metadata
- [ ] Add unit tests for validation rules
- [ ] Add integration tests for create/edit/cancel auth and rules
- [ ] Acceptance check: seller listing lifecycle complete

## Phase 2 - Browse and Search Listings
Status: Not Started
- [ ] Build listings browse page with pagination
- [ ] Add query-layer filters (category, price, status, timing)
- [ ] Add text search over title/description
- [ ] Add sorting options (ending soon, highest bid, newest)
- [ ] Persist filter/sort state via URL params
- [ ] Optimize DB indexes for expected query patterns
- [ ] Add unit tests for filter-parser/query-builder logic
- [ ] Add integration tests for filter/sort/pagination combinations
- [ ] Acceptance check: browse/search UX and correctness approved

## Phase 3 - Bidding and Real-Time Updates
Status: Not Started
- [ ] Extend schema for bids and listing current bid tracking
- [ ] Add bid placement Zod schema and business rules
- [ ] Implement atomic place-bid server action (transaction)
- [ ] Prevent owner bidding on own listing
- [ ] Implement real-time updates (SSE + fallback polling)
- [ ] Update listing detail UI with live bid state
- [ ] Add unit tests for bid increment and eligibility rules
- [ ] Add integration tests for concurrent bid scenarios
- [ ] Acceptance check: live bidding works under contention

## Phase 4 - Auction Finalization and Notifications
Status: Not Started
- [ ] Add schema fields/tables for finalization + notifications
- [ ] Implement auction close domain service (idempotent)
- [ ] Create scheduled job endpoint/runner for expired listings
- [ ] Implement winner selection with reserve-price handling
- [ ] Implement in-app notification creation and read state
- [ ] Add optional email notification adapter (feature-flagged)
- [ ] Add unit tests for close logic variants
- [ ] Add integration tests for job reruns and duplicate protection
- [ ] Acceptance check: automated close + notifications verified

## Phase 5 - User Dashboard
Status: Not Started
- [ ] Build dashboard route/layout with tabs/sections
- [ ] Add queries for my listings (active/ended)
- [ ] Add queries for my bids and current bid state
- [ ] Add queries for watchlist items
- [ ] Implement watch/unwatch server actions
- [ ] Add pagination and empty-state UX for all sections
- [ ] Add unit tests for dashboard data mappers
- [ ] Add integration tests for user-scoped access and data
- [ ] Acceptance check: dashboard reflects user activity accurately

## Phase 6 - AI Smart Listing Creator
Status: Not Started
- [ ] Add AI server action endpoint for listing draft generation
- [ ] Define strict output schema (title, description, category, price)
- [ ] Build photo upload + prompt UI for AI draft generation
- [ ] Implement Vercel AI SDK model call with structured output
- [ ] Add moderation/safety checks and fallback error messages
- [ ] Add rate limiting for AI generation action
- [ ] Add user review/edit step before persist
- [ ] Add unit tests for parsing/validation/fallbacks
- [ ] Add integration tests for success + model failure paths
- [ ] Acceptance check: AI drafts are reliable and editable

## Phase 7 - AI Natural Language Search
Status: Not Started
- [ ] Add NL query input to browse page
- [ ] Build AI parser action returning typed filter object
- [ ] Merge AI filters safely with manual filters
- [ ] Display interpreted filter chips for user correction
- [ ] Implement fallback to keyword search on parser failure
- [ ] Add telemetry/logging for parse success/failure rates
- [ ] Add unit tests for NL-to-filter mapping
- [ ] Add integration tests for mixed manual + NL filtering
- [ ] Acceptance check: interpreted search is useful and stable

## Phase 8 - AI Description Enhancer
Status: Not Started
- [ ] Add description enhancer UI in listing create/edit flow
- [ ] Define enhancement request schema (tone, audience, length)
- [ ] Implement AI rewrite action returning multiple variants
- [ ] Add side-by-side compare/diff and apply action
- [ ] Ensure explicit user acceptance before updating content
- [ ] Add safety checks to prevent fabricated claims insertion
- [ ] Add unit tests for rewrite schema handling
- [ ] Add integration tests for end-to-end apply workflow
- [ ] Acceptance check: rewrite assist improves UX without risk

## Phase 9 - Polish, CI, Prod DB Switch and Publishing
Status: Not Started
- [ ] Select production DB provider (Postgres) and provision env
- [ ] Update Drizzle config/migrations for prod DB target
- [ ] Validate data migration strategy from SQLite to Postgres
- [ ] Add env validation layer for required production secrets
- [ ] Finalize CI with coverage artifact/reporting
- [ ] Run performance and accessibility pass on major routes
- [ ] Prepare demo seed data and reset scripts
- [ ] Update deployment docs and release runbook
- [ ] Execute production deployment checklist
- [ ] Acceptance check: deployed app is stable and documented

## Tracking Notes
- Use dated notes here during implementation for scope changes and decisions.
- 2026-02-27: Initial phase plan created.
- 2026-02-27: Phase 0 implemented with grouped route migration, canonical `src/lib/db` + `src/lib/validators` paths, transaction-based integration test harness, fixture factories, and MSW baseline mocking.
- 2026-02-27: Phase 0 formally approved; tracking moved to Phase 1 in progress.
