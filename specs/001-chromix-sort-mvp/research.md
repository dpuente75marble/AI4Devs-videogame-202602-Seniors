# Research: Chromix Sort MVP

**Feature**: `specs/001-chromix-sort-mvp`  
**Date**: 2026-04-11

Consolidated decisions for planning; no open NEEDS CLARIFICATION items from technical context.

---

## R1 — Application architecture

**Decision**: Single-page static client with unidirectional flow: input → state/rules → view render.

**Rationale**: Matches `chromix-sort-dlp/docs/technical-design.md` and constitution Principle III (state as source of truth).

**Alternatives considered**: Lightweight framework (React/Vue) — rejected for MVP to satisfy explicit “HTML, CSS, JavaScript only” baseline and reduce build surface.

---

## R2 — Module loading and local development

**Decision**: Use native ES modules (`type="module"`) split across `js/*.js`. Document local preview via a static HTTP server (e.g., `python3 -m http.server` or `npx serve`) to avoid `file://` module/CORS friction.

**Rationale**: ES modules keep separation testable and readable; static server is zero-backend and matches deployment as static files.

**Alternatives considered**: Single non-module bundle — acceptable but worse for clarity/testing; rejected as primary recommendation. IIFE in one file — fastest for tiny scope but blurs rule/view split.

---

## R3 — Browser support

**Decision**: Target **current evergreen** desktop browsers (Chrome, Firefox, Safari, Edge) and current iOS Safari / Android Chrome; avoid polyfills unless a course baseline mandates an older engine.

**Rationale**: Academic demo on developer and typical user devices; functional spec RNF-03 defers exact floor to technical plan.

**Alternatives considered**: Declaring only “latest Chrome” — too narrow for mobile demo requirement in spec.

---

## R4 — Input during transitions

**Decision**: While a short move animation runs (if implemented), ignore or coalesce extra move attempts so only one logical move queue slot exists; authoritative state updates immediately, animation is presentation-only.

**Rationale**: Functional spec RNF-02 and spec edge cases forbid impossible states from rapid input.

**Alternatives considered**: Full input queue — unnecessary complexity for single-board MVP.

---

## R5 — Error copy strategy

**Decision**: Map each rule rejection to a **specific short message** (empty source, destination full, color mismatch, same-tube cancel) so messages teach the failing condition.

**Rationale**: Constitution Principle V and functional RNF-06.

**Alternatives considered**: Generic “Invalid move” only — fails SC-003 and product promise.

---

## R6 — Testing strategy

**Decision**: Ship with a written **manual test matrix** in `quickstart.md` (and referenced from tasks later). Optionally add Node unit tests importing `rules.js` if the project enables `"type": "module"` in a small `package.json` or uses `.mjs` — not required for constitution compliance.

**Rationale**: Constitution requires verifiable rules at minimum; pure functions in `rules.js` are the natural automation seam.

**Alternatives considered**: E2E with Playwright — optional stretch; not required for static MVP.

---

## R7 — Session timer

**Decision**: Include elapsed-time display in victory summary **if** trivial to implement with `performance.now()` or `Date` deltas in session state; omit if schedule-critical path omits it—functional spec allows “and/or time.”

**Rationale**: Spec FR-009 allows optional time; plan prefers consistency with technical design §3.7.

**Alternatives considered**: Moves-only summary — still satisfies FR-009 minimum.
