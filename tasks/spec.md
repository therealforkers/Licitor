# Licitor Technical Specification

## Document Metadata
- Project: `licitor`
- Last updated: 2026-02-27
- Owner: Product + Engineering
- Status legend: `Not Started`, `In Progress`, `Blocked`, `Accepted`

## Phase Tracker
| Phase | Name | Status | Acceptance Gate |
|---|---|---|---|
| 0 | Foundation and Tooling | Accepted | Build + lint + unit + integration baseline stable |
| 1 | Listing Creation and Management | In Progress | Listing CRUD + image upload + validation complete |
| 2 | Browse and Search Listings | Not Started | Search/filter UX and query performance accepted |
| 3 | Bidding and Real-Time Updates | Not Started | Bid flow + concurrency + live updates accepted |
| 4 | Auction Finalization and Notifications | Not Started | Auction close job + winner selection + notifications accepted |
| 5 | User Dashboard | Not Started | My listings, bids, watching views accepted |
| 6 | AI Smart Listing Creator | Not Started | AI draft generation with guardrails accepted |
| 7 | AI Natural Language Search | Not Started | NL query parsing to structured filters accepted |
| 8 | AI Description Enhancer | Not Started | AI rewrite workflow accepted |
| 9 | Polish, CI, Prod DB switch and publishing | Not Started | CI/CD + prod DB migration + deploy readiness accepted |

## Product Goals
- Build a simplified eBay-style auction app for learning and portfolio-quality engineering.
- Keep architecture clear and testable with strong typing and validation.
- Ship incrementally via phase gates with measurable acceptance criteria.

## Non-Goals (Current Scope)
- Complex shipping/payment/dispute workflows.
- Multi-currency checkout and tax/VAT handling.
- Enterprise moderation and anti-fraud systems.

## Current Stack and Constraints
- Framework: Next.js 16 (App Router) + React 19 + TypeScript.
- Auth: BetterAuth (already implemented for register/login/profile).
- DB: SQLite + Drizzle ORM (dev first), switch to prod DB in Phase 9.
- UI: Tailwind v4 + shadcn components.
- Forms: React Hook Form + Zod.
- AI: Vercel AI SDK.
- Tests: Vitest (unit + integration), minimum 80% coverage per phase.

## System Architecture (Target)
- `src/app/*`: routes, pages, server components.
- Route grouping policy:
- `src/app/(auth)/*` contains auth pages (`/login`, `/register`) and auth-only shells.
- `src/app/(main)/*` contains product pages (`/`, `/listings`, `/dashboard`, `/profile`).
- No duplicate non-grouped route trees for paths owned by route groups.
- `src/server/actions/*`: writes/mutations (create listing, place bid, watch item, etc.).
- `src/server/queries/*`: read models and filtering/search queries.
- `src/lib/db/*`: Drizzle client, schema, seed.
- `src/lib/validators/*`: shared Zod schemas (input/output contracts).
- `src/components/ui/*`: shadcn primitives.
- `src/components/*`: feature components.
- `test/unit/*`: pure logic tests.
- `test/integration/*`: DB + action/query integration tests.

### Canonical Source Tree (Phase 0)
- `src/app/(auth)`
- `src/app/(main)/listings`
- `src/app/(main)/dashboard`
- `src/app/(main)/profile`
- `src/app/api/auth/[...all]`
- `src/app/api/cloudinary`
- `src/components/ui`
- `src/components/auth`
- `src/components/listings`
- `src/components/bidding`
- `src/components/dashboard`
- `src/components/shared`
- `src/lib/auth.ts`
- `src/lib/auth-client.ts`
- `src/lib/utils.ts`
- `src/lib/db`
- `src/lib/validators`
- `src/lib/ai`
- `src/hooks`
- `src/server/actions`
- `src/server/queries`
- `src/types`

## Data Model (Target Additions)
- `listings`
- `listing_images`
- `bids`
- `watchlist`
- `auction_events` (optional audit trail)
- `notifications`

### Listing (target fields)
- `id`, `sellerId`, `title`, `description`, `category`, `condition`
- `startingBid`, `reservePrice` (nullable), `currentBid`
- `startAt`, `endAt`, `status` (`draft|live|ended|cancelled`)
- `winnerBidId` (nullable), `createdAt`, `updatedAt`

### Bid (target fields)
- `id`, `listingId`, `bidderId`, `amount`, `createdAt`
- unique/index strategy to support efficient highest-bid queries

### Watchlist
- `id`, `listingId`, `userId`, `createdAt`
- unique `(listingId, userId)`

### Notification
- `id`, `userId`, `type`, `payloadJson`, `readAt` (nullable), `createdAt`

## Cross-Cutting Requirements
- Authorization: only owners can edit/cancel own listings; only authenticated users can bid/watch.
- Validation: all form and server action inputs validated via Zod.
- Error handling: typed result pattern for expected business errors.
- Idempotency/concurrency: bid placement must be transaction-safe.
- Accessibility: keyboard-friendly forms, labels, focus states.
- Observability: structured logs for key domain events.

## Testing and Quality Gates
- Required per phase before acceptance:
- `npm run lint` passes.
- `npm run build` passes.
- Unit + integration tests added for all new behavior.
- Coverage >= 80% for changed/new modules (line + branch target).
- Include edge case tests (authorization, validation, race conditions where relevant).

## Phase Specifications

## Phase 0 - Foundation and Tooling
Approval note: Approved on 2026-02-27.

### Scope
- Canonicalize folder layout, route grouping, and import paths.
- Establish deterministic test infrastructure and reusable test primitives.
- Lock acceptance gates for lint, build, unit, and integration checks.

### Requirements
- Source layout and routing:
- Use grouped routes only for auth/main pages and remove duplicate non-grouped route implementations.
- Scaffold missing directories in `src/` for app/components/lib/hooks/server/types.
- Canonicalize imports so app/server/test code resolves DB from `@/lib/db/*` and validators from `@/lib/validators/*`.
- Testing architecture:
- Use Vitest split config for unit and integration suites.
- Use one integration SQLite DB (`test/test.db`).
- Run migrations once in `test/global-setup.integration.ts`.
- Apply per-test transaction rollback hooks from shared helpers (`withTestTransaction(...)` or equivalent).
- Keep deterministic hard-reset helper as explicit fallback only when transaction rollback is unsuitable.
- Baseline testing assets:
- Add fixtures in `test/fixtures` with at least user and listing factories.
- Add MSW baseline handlers in `test/mocks` plus setup wiring.
- Include one fixture usage example in integration tests.
- Include one MSW usage example in unit tests.
- Quality gates:
- `npm run lint`
- `npm run build`
- `npm run test:unit`
- `npm run test:integration`

### Deliverables
- Updated `tasks/spec.md` with Phase 0 requirements and canonical tree.
- Updated `tasks/todo.md` with ordered implementation checklist and dependencies.
- Implemented route-group canonicalization and module-path migration.
- Implemented integration transaction harness, fixture factories, and MSW baseline mock wiring.
- Verified local quality gates are green.

### Acceptance
- No runtime/test imports remain from deprecated paths `@/db/*` or `@/lib/validation/*`.
- Grouped routes serve `/(auth)` and `/(main)` endpoints with no duplicate top-level route files for same endpoints.
- Integration tests run against one DB and roll back each test transaction.
- Fixture and MSW usage examples execute in tests.
- Local quality gates pass: lint, build, unit, integration.

## Phase 1 - Listing Creation and Management
### Scope
- Sellers can create and manage auction listings with photos and scheduling.

### Requirements
- Create listing form with:
- title, description, category, starting bid, optional reserve price, end date.
- photo upload (single required, multi-image optional stretch).
- Server action to create listing with ownership and validation.
- Listing edit/cancel flows (seller-only).
- Listing detail page shows auction metadata.

### Validation rules
- `startingBid > 0`.
- `reservePrice` nullable, but if present `reservePrice >= startingBid`.
- `endDate` must be in the future and within max window (e.g. <= 30 days).

### Acceptance
- Seller can create/edit/cancel listing.
- Unauthorized users cannot mutate others' listings.
- Comprehensive tests for schema and actions.

## Phase 2 - Browse and Search Listings
### Scope
- Public browsing and filter/search over active listings.

### Requirements
- Listings index with pagination.
- Filters: category, min/max price, ending soon, newly listed.
- Text search on title/description (SQLite FTS if adopted, otherwise indexed LIKE with constraints).
- Sorting: ending soon, highest bid, newest.

### Acceptance
- Query logic returns correct filtered/sorted datasets.
- UI keeps filter state in URL query params.
- Tests cover query composition and pagination edge cases.

## Phase 3 - Bidding and Real-Time Updates
### Scope
- Place bids with real-time current price updates.

### Requirements
- Bid form on listing detail for authenticated non-owner users.
- Min next bid rule (`>= currentBid + increment`).
- Atomic bid placement in transaction.
- Real-time updates for current bid/highest bidder state.
- Approach: SSE channel per listing (fallback polling if connection unavailable).

### Acceptance
- Concurrent bids resolve consistently (highest valid bid wins).
- Client updates without full page refresh.
- Tests simulate concurrent bid attempts and rule enforcement.

## Phase 4 - Auction Finalization and Notifications
### Scope
- Automatically end auctions and notify winning/affected users.

### Requirements
- Scheduled finalization job scans expired live listings.
- Closing logic:
- if reserve met: set winner and mark ended.
- if reserve unmet: mark ended/no winner.
- Create notifications for seller, winning bidder, and optionally outbid watchers.
- Notification channels:
- in-app notifications required.
- email optional (feature flag/config).

### Acceptance
- Finalization is idempotent and safe to rerun.
- Notifications generated correctly by scenario.
- Tests cover reserve met/unmet and duplicate-job execution.

## Phase 5 - User Dashboard
### Scope
- User-centric views for listing/bidding activity.

### Requirements
- Tabs/sections:
- My Listings (active/ended)
- My Bids (with bid status)
- Watching (watchlisted items)
- Quick actions (edit listing, unwatch, jump to bidding).

### Acceptance
- Dashboard data is scoped to current user.
- Efficient queries with pagination.
- Tests for authorization and empty/populated states.

## Phase 6 - AI Smart Listing Creator
### Scope
- AI-assisted listing draft from uploaded photos.

### Requirements
- Upload photos and optional short prompt.
- Vercel AI SDK pipeline returns:
- suggested title
- suggested description
- suggested category
- suggested starting price range
- User reviews/edits before saving; AI output is never auto-published.
- Include confidence and fallback behavior.

### Guardrails
- Prompt template with strict JSON schema output.
- Content moderation/filtering for unsafe outputs.
- Rate limiting per user.

### Acceptance
- Structured AI output passes schema validation.
- Failed model output falls back gracefully.
- Tests for parser/validator and failure handling.

## Phase 7 - AI Natural Language Search
### Scope
- Parse natural language queries into structured search filters.

### Requirements
- Input like: `vintage watches under 100`.
- AI parser outputs typed filter object:
- keywords, category, price ceiling/floor, condition, sort intent.
- Merge AI-derived filters with explicit UI filters safely.
- Show interpreted query chips so user can adjust.

### Acceptance
- Parser handles ambiguous input with safe defaults.
- No unsafe direct SQL/query string generation.
- Tests for parser mappings and fallback to keyword-only search.

## Phase 8 - AI Description Enhancer
### Scope
- AI rewrite tool to improve seller descriptions.

### Requirements
- User enters draft description and tone intent.
- AI returns rewritten variants (e.g. concise, persuasive, premium).
- Diff/compare UI before apply.
- Preserve factual details and avoid fabricated claims.

### Acceptance
- User must explicitly accept rewrite.
- Schema-validated output and error states are covered.
- Tests for transform action and UI integration flow.

## Phase 9 - Polish, CI, Prod DB Switch and Publishing
### Scope
- Harden app for deployment and handoff.

### Requirements
- Production DB migration plan (SQLite -> managed Postgres, Drizzle-compatible).
- Env var documentation and validation.
- CI quality gates with coverage reporting.
- Performance/accessibility pass on key pages.
- Seed/demo data for showcase.
- Deployment target (e.g. Vercel) and release checklist.

### Acceptance
- Staging/prod builds healthy.
- DB migration executed and verified.
- Documentation updated for setup, run, and deploy.

## Definition of Done (Per Phase)
- Feature scope implemented and reviewed.
- Tests written and passing with >=80% coverage for phase changes.
- Lint/build pass.
- Phase status in this document updated to `Accepted`.
- `tasks/todo.md` checkboxes updated to reflect completed work.
