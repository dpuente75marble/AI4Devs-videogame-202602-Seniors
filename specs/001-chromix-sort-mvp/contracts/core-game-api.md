# Contract: Core game API (rules + state transitions)

**Feature**: `specs/001-chromix-sort-mvp`  
**Date**: 2026-04-11

Semantic contract between **input/controller**, **state**, and **rules** modules. Not an HTTP API.

## Types (conceptual)

- `GameState` — see [data-model.md](../data-model.md)
- `MoveResult = OkResult | ErrResult`

```text
OkResult { ok: true, state: GameState }
ErrResult { ok: false, reason: RuleViolation, state: GameState }  // same state reference or deep-equal board
```

- `RuleViolation` — stable machine-facing codes, mapped to user strings in view:

  - `SOURCE_EMPTY`
  - `DEST_FULL`
  - `COLOR_MISMATCH`
  - `SAME_TUBE` (if treated as error)
  - `INVALID_INDEX`
  - `GAME_LOCKED` (e.g., attempt move while `phase === won` if moves disabled)

## Operations

### `createInitialState(config: MvpConfig): GameState`

Returns deep-cloned playable state: `phase = playing`, metrics zeroed, `selection = none`.

### `tryMove(state: GameState, fromIndex: number, toIndex: number): MoveResult`

1. Validates indices and phase.  
2. If illegal index or locked phase → `ErrResult` with unchanged board stacks.  
3. Evaluates tube rules on a **logical copy** of stacks; on success returns new `GameState` with:

   - updated `board`
   - `metrics.moveCount` incremented by 1
   - `selection` cleared (recommended)
   - `phase` set to `won` if `checkWin(newBoard)` else `playing`
   - `feedback` cleared or set to success stub (optional)

4. On rule failure → **identical** stack contents as input, appropriate `reason`, optional `feedback` payload for the view.

**Must not** mutate the input state object in place (clone-on-write or fresh object).

### `checkWin(board: Board): boolean`

True iff every tube is empty or monochromatic.

### `reset(config: MvpConfig): GameState`

Equivalent to `createInitialState(config)`.

## Invariants (callers must preserve)

- Only `tryMove` / `reset` / `createInitialState` change stack contents.  
- View code never pushes/pops pieces without going through this API.  
- `moveCount` increases only inside successful `tryMove`.
