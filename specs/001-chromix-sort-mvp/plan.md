# Implementation Plan: Chromix Sort MVP

**Branch**: `001-chromix-sort-mvp` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-chromix-sort-mvp/spec.md`

**Note**: This plan aligns with `chromix-sort-dlp/docs/product-definition.md`, `chromix-sort-dlp/docs/functional-spec.md`, and `chromix-sort-dlp/docs/technical-design.md`.

## Summary

Deliver a single-player **Chromix Sort** MVP in the browser: one fixed board, tubes with colored pieces, two-step tube selection for moves, deterministic rule validation (top piece only, capacity, color match), move counter, reset, win detection with summary, responsive polished UI, and keyboard-equivalent control. Implementation uses **static HTML, CSS, and JavaScript** only, with **game state and rules separated from the view**, no backend, auth, or persistence—matching the constitution and technical design.

## Technical Context

**Language/Version**: JavaScript (ES2020+ features acceptable where supported; align with browsers in research.md)  
**Primary Dependencies**: None required (vanilla modules or scripts per technical design); no UI framework for MVP  
**Storage**: N/A (in-memory session only; no `localStorage` / cookies for game state)  
**Testing**: Manual test matrix required (constitution); optional automated unit checks for pure rule functions via Node.js built-in test runner if the team adds it  
**Target Platform**: Modern desktop and mobile browsers (see research.md for version stance)  
**Project Type**: static single-page web game  
**Performance Goals**: Player-perceived immediate feedback on interaction (functional spec: sub-100 ms orienting target under normal conditions; plan assumes synchronous rule application + one frame paint)  
**Constraints**: Constitution static-client-only; no server round-trip to play; deterministic rules; no hidden board state outside the model  
**Scale/Scope**: One board layout, one screen, academic-demo polish (not a level catalog)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence in this plan |
|-----------|--------|------------------------|
| **Documentation authority** | Pass | Scope matches spec + `chromix-sort-dlp/docs/*`; no extra levels, accounts, or APIs. |
| **Static client MVP** | Pass | HTML/CSS/JS only; implementation tree under `chromix-sort-dlp/` as static assets. |
| **Domain model** | Pass | `data-model.md` + `contracts/core-game-api.md` separate rule results from view; view syncs from state only. |
| **Testable rules** | Pass | Verification section below + `quickstart.md` manual checks; optional Node tests for `rules` module. |
| **UX / accessibility** | Pass | Keyboard mapping documented in contracts; responsive CSS; rule-teaching copy codes in plan/research. |

**Post-Phase 1 re-validation**: Design artifacts (`data-model.md`, contracts, quickstart) preserve the same separation of concerns, add no backend or persistence, and keep verification obligations explicit. **No change to gate status.**

## Verification approach (rules and outcomes)

1. **Manual matrix** (required minimum): rows for empty source, full destination, color mismatch, valid move, win from known layout, reset from mid-game and from victory; pointer path and keyboard path each complete one win once layout exists.  
2. **Automated (optional)**: Export or isolate pure functions in `js/rules.js` (or equivalent) and cover move legality, apply-move mutation on a clone, `checkWin`, and reset-to-config snapshot equality.

## Project Structure

### Documentation (this feature)

```text
specs/001-chromix-sort-mvp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── core-game-api.md
│   └── ui-accessibility.md
└── tasks.md              # produced by /speckit.tasks (not this command)
```

### Source Code (implementation root)

Implementation is created under **`chromix-sort-dlp/`** at repository root (docs already live there; code follows technical design).

```text
chromix-sort-dlp/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── config.js
│   ├── state.js
│   ├── rules.js
│   ├── view.js
│   └── input.js
├── assets/                 # optional (fonts, icons)
└── docs/                   # existing product + SDD + technical design
```

**Structure Decision**: Single static front-end per technical design §5. Files may be merged slightly (e.g., `state.js` + `rules.js`) only if boundaries stay explicit in naming and exports; prefer separate `rules.js` for testability.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|----------------------------------------|
| — | — | No constitution violations for this plan. |
