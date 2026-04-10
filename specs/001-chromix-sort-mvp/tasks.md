---
description: "Task list for Chromix Sort MVP implementation"
---

# Tasks: Chromix Sort MVP

**Input**: Design documents from `/specs/001-chromix-sort-mvp/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: No automated test tasks (not requested in spec). Verification uses the manual matrix in [quickstart.md](./quickstart.md).

**Organization**: Phases follow user story priorities from [spec.md](./spec.md); implementation root is `chromix-sort-dlp/` per [plan.md](./plan.md).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependency on incomplete tasks in the same batch)
- **[Story]**: User story label ([US1]–[US4]) on story-phase tasks only

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Static project shell and module entry so the browser can load the game.

- [ ] T001 Create `chromix-sort-dlp/index.html` with semantic structure (title, main game region, reset control placeholder, `link` to `chromix-sort-dlp/css/styles.css`, `script type="module"` entry `chromix-sort-dlp/js/main.js`)
- [ ] T002 [P] Create `chromix-sort-dlp/css/styles.css` with baseline reset, root layout, and placeholder regions for board and status text
- [ ] T003 [P] Create `chromix-sort-dlp/js/main.js` as ES module entry that will import config, state, view, and input (stub imports acceptable until later tasks)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Read-only config, pure rules, and mutable state API—**no user story work before this is done**.

**⚠️ CRITICAL**: User stories cannot start until Phase 2 completes.

- [ ] T004 [P] Implement `chromix-sort-dlp/js/config.js` exporting `MvpConfig` (per-tube `capacity` and `initialPieces` bottom→top as `ColorId` values) matching [data-model.md](./data-model.md); choose one solvable fixed layout and document tube count in a short comment
- [ ] T005 [P] Implement `chromix-sort-dlp/js/rules.js` with immutable `tryMove` / `checkWin` behavior and `RuleViolation` codes exactly as [contracts/core-game-api.md](./contracts/core-game-api.md) (no DOM imports)
- [ ] T006 Implement `chromix-sort-dlp/js/state.js` with `createInitialState`, `reset`, and move application that delegates to `rules.js`, preserves board invariants, increments `moveCount` only on successful moves, sets `phase` to `won` when `checkWin` is true after a move

**Checkpoint**: Foundation ready—domain layer is playable from console or temporary logging.

---

## Phase 3: User Story 1 — Play the puzzle on one fixed board (Priority: P1) 🎯 MVP

**Goal**: Render the MVP board and complete the select-source → select-dest loop with valid moves updating the model and UI.

**Independent Test**: From initial layout, perform only valid moves until win without relying on polished error copy (errors may be raw); board state stays consistent with [spec.md](./spec.md) US1 acceptance scenarios.

### Implementation for User Story 1

- [ ] T007 [P] [US1] Implement `chromix-sort-dlp/js/view.js` to build/update DOM for tubes and pieces from `GameState.board`, including visible capacity and selection highlight driven by `selection`
- [ ] T008 [P] [US1] Implement `chromix-sort-dlp/js/input.js` pointer flow: first tube sets source, second tube attempts move via state API; use focusable controls or buttons per [contracts/ui-accessibility.md](./contracts/ui-accessibility.md) baseline
- [ ] T009 [US1] Complete `chromix-sort-dlp/js/main.js` to load `MvpConfig`, create initial state, subscribe render on every state change, and register `input.js` handlers

**Checkpoint**: US1 playable end-to-end with pointer; win may show minimal UI until US3.

---

## Phase 4: User Story 2 — Understand mistakes through clear feedback (Priority: P2)

**Goal**: Invalid moves leave state unchanged and show short, rule-specific teaching messages.

**Independent Test**: Trigger `SOURCE_EMPTY`, `DEST_FULL`, and `COLOR_MISMATCH`; each shows distinct teaching copy and identical board stacks before/after attempt.

### Implementation for User Story 2

- [ ] T010 [US2] Extend `chromix-sort-dlp/js/view.js` to map each `RuleViolation` from [contracts/core-game-api.md](./contracts/core-game-api.md) to user-facing strings and render them in a `role="status"` (or `alert`) region with sufficient contrast
- [ ] T011 [US2] Refine `chromix-sort-dlp/js/input.js` for second click on same tube (cancel selection) and clear/refresh feedback timing per [spec.md](./spec.md) edge cases without mutating stacks outside `state.js`

**Checkpoint**: US2 feedback quality meets SC-003 intent; still passes US1 flows.

---

## Phase 5: User Story 3 — Finish, celebrate, and restart (Priority: P2)

**Goal**: Victory overlay with session summary (moves; optional elapsed time) and working reset from play and win states.

**Independent Test**: Reach `phase === won`, read summary, press reset, confirm layout and counters match a fresh session from `config.js`.

### Implementation for User Story 3

- [ ] T012 [US3] Extend `chromix-sort-dlp/js/view.js` with victory overlay when `phase === won`, displaying `moveCount` and elapsed time if `SessionMetrics` tracks it ([research.md](./research.md) R7)
- [ ] T013 [US3] Wire reset `button` in `chromix-sort-dlp/index.html` through `chromix-sort-dlp/js/main.js` to `state` reset + full re-render; ensure reset works from `playing` and `won`

**Checkpoint**: US3 demo loop complete (play → win → reset).

---

## Phase 6: User Story 4 — Play on common devices with pointer or keyboard (Priority: P3)

**Goal**: Responsive layout and keyboard-equivalent control for all game actions.

**Independent Test**: Complete one win path with pointer and one with keyboard only on a ~390px-wide viewport per [quickstart.md](./quickstart.md).

### Implementation for User Story 4

- [ ] T014 [P] [US4] Extend `chromix-sort-dlp/js/input.js` so Tab/Enter/Space (and optional arrows documented in `chromix-sort-dlp/README.md`) mirror pointer two-step semantics per [contracts/ui-accessibility.md](./contracts/ui-accessibility.md)
- [ ] T015 [P] [US4] Implement responsive tube sizing, spacing, and touch-friendly targets in `chromix-sort-dlp/css/styles.css` for desktop and narrow mobile widths
- [ ] T016 [US4] Audit `chromix-sort-dlp/index.html` and `chromix-sort-dlp/js/view.js` for ARIA labels, focus order, and visible focus rings on tubes and reset

**Checkpoint**: US4 acceptance scenarios satisfied alongside US1–US3.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Demo polish, documentation, and interaction safety across stories.

- [ ] T017 Execute every row of the manual matrix in [quickstart.md](./quickstart.md); track pass/fail and fix defects in `chromix-sort-dlp/js/*.js` or `chromix-sort-dlp/css/styles.css` as needed
- [ ] T018 [P] Add `chromix-sort-dlp/README.md` with local static server command, keyboard map, and link to course docs under `chromix-sort-dlp/docs/`
- [ ] T019 Guard `chromix-sort-dlp/js/input.js` against duplicate move submissions during short CSS transitions so rapid input cannot desync model and view ([research.md](./research.md) R4)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1** → **Phase 2** → **Phase 3 (US1)** → **Phase 4 (US2)** → **Phase 5 (US3)** → **Phase 6 (US4)** → **Phase 7**
- **US2** depends on US1 (needs render + input pipeline).
- **US3** depends on US1 (needs moves and phase transitions); integrates with US2 messaging optionally.
- **US4** depends on US1–US3 behavior being correct; refines input/CSS without changing rules.

### User Story Dependencies

| Story | Depends on |
|-------|------------|
| US1 (P1) | Phase 2 only |
| US2 (P2) | US1 |
| US3 (P2) | US1 (US2 recommended first for messaging polish) |
| US4 (P3) | US1–US3 |

### Parallel Opportunities

- **Phase 1**: T002 and T003 parallel with each other after T001 exists (or T001–T003 all parallel if filenames coordinated—prefer T001 first for HTML path correctness).
- **Phase 2**: T004 and T005 in parallel; **T006** after both.
- **US1**: T007 and T008 in parallel; **T009** after both.
- **US4**: T014 and T015 in parallel; **T016** after for holistic a11y pass.
- **Phase 7**: T018 parallel while T017 is manual; T019 after interaction paths stable.

---

## Parallel Example: User Story 1

```text
# After Phase 2 completes, start together:
- T007 [US1] view.js DOM sync from GameState
- T008 [US1] input.js pointer selection + state calls

# Then sequential:
- T009 [US1] main.js orchestration
```

---

## Parallel Example: Phase 2

```text
# Start together:
- T004 config.js MvpConfig
- T005 rules.js pure tryMove/checkWin

# Then:
- T006 state.js integration
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 and Phase 2.  
2. Complete Phase 3 (US1).  
3. **STOP**: Run US1 independent test and a minimal win-path check.  
4. Demo if sufficient for earliest milestone.

### Incremental Delivery

1. Add Phase 4 (US2) → clearer teaching feedback.  
2. Add Phase 5 (US3) → repeatable academic demo loop.  
3. Add Phase 6 (US4) → mobile + keyboard readiness.  
4. Add Phase 7 → polish and documented verification.

### Parallel Team Strategy

After Phase 2, one developer can own `view.js` (T007) while another owns `input.js` (T008), then pair on `main.js` (T009).

---

## Task Summary

| Phase | Task IDs | Count |
|-------|-----------|-------|
| Setup | T001–T003 | 3 |
| Foundational | T004–T006 | 3 |
| US1 | T007–T009 | 3 |
| US2 | T010–T011 | 2 |
| US3 | T012–T013 | 2 |
| US4 | T014–T016 | 3 |
| Polish | T017–T019 | 3 |
| **Total** | **T001–T019** | **19** |

**Format validation**: All tasks use `- [ ]`, sequential `T###` IDs, file paths in descriptions, `[US#]` only on story phases, `[P]` only where parallel-safe.

---

## Notes

- Do not introduce `localStorage`, backend calls, or auth—constitution baseline.  
- Keep rule logic out of `view.js`; only `rules.js` / `state.js` change stacks.  
- Commit after each task or logical group; optional hook: `speckit.git.commit` after tasks generation.
