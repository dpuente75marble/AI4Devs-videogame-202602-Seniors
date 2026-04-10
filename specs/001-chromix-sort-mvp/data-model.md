# Data Model: Chromix Sort MVP

**Feature**: `specs/001-chromix-sort-mvp`  
**Date**: 2026-04-11  
**Sources**: [spec.md](./spec.md), functional spec §4, technical design §4

## Overview

All mutable play data lives in one **game state** object owned by the client. Rules consume immutable snapshots (or clones) and return either a new state or a rejection with a stable prior state.

## Entities

### ColorId

- **Description**: Stable identifier for a piece color (`string` or enum-like constant).
- **Validation**: Finite set defined by MVP config; same token always renders the same color.

### Piece

- **Fields**: `color: ColorId`
- **Rules**: A piece belongs to exactly one tube at any time (by array membership).

### Tube

- **Fields**:
  - `id` or implicit index `0..N-1`
  - `capacity: number` (≥ 1, fixed per tube for MVP)
  - `pieces: Piece[]` ordered **bottom → top** (index `length - 1` is top)
- **Invariants**:
  - `pieces.length <= capacity`
  - Order represents stack physics for rendering

### Board

- **Fields**: `tubes: Tube[]` (fixed length N for MVP)

### Phase

- **Values**: `playing` | `won` | `paused` (optional; pause only blocks input)
- **Transitions**: See below

### SessionMetrics

- **Fields**:
  - `moveCount: number` (increments only on applied valid moves)
  - `startedAt: number` (optional DOMHighResTimeStamp or epoch ms for elapsed time)

### SelectionState (UI coupling)

- **Values**: `none` | `{ phase: 'source', tubeIndex: number }`
- **Purpose**: Drives highlights; must not change tube stacks without going through rules.

### TransientFeedback

- **Fields**: `messageKey` or `message: string`, optional `severity: 'error' | 'info'`
- **Rules**: Cleared on next successful move, reset, or timeout per UX choice; not persisted

## Aggregate: GameState

Conceptual shape (implementation may nest names differently):

```text
GameState {
  board: Board
  phase: Phase
  selection: SelectionState
  metrics: SessionMetrics
  feedback?: TransientFeedback
}
```

## State transitions

| Event | Preconditions | Board / metrics change | Phase / selection |
|-------|---------------|------------------------|-------------------|
| Load / initial | — | Cloned from `config` | `playing`, `selection: none` |
| Select tube (no source yet) | `phase === playing` | — | `source` set |
| Select different tube as dest | `phase === playing`, valid indices | If move valid: stacks + `moveCount++` | Clear or keep per UX; if invalid: unchanged board |
| Same tube twice | `phase === playing` | — | Cancel selection or no-op (documented once) |
| Win detected | After valid move | — | `won`; optional input lock except reset |
| Reset | Any | Board from config clone; metrics zeroed | `playing`, `selection: none`, feedback cleared |
| Reload page | — | Discarded | New session from config |

## Validation rules (domain)

Derived from functional spec §4.2–4.4:

1. Source top piece exists (source not empty).  
2. Destination has `pieces.length < capacity`.  
3. Destination empty **or** `top(dest).color === top(source).color`.  
4. Win iff every tube is empty **or** all pieces in that tube share one `ColorId`.

## Configuration (read-only)

Separate from `GameState`:

```text
MvpConfig {
  tubes: { capacity: number, initialPieces: ColorId[] }[]
}
```

`initialPieces` bottom → top order to seed `Tube.pieces` on load/reset.
