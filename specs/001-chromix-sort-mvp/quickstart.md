# Quickstart: Chromix Sort MVP

**Feature**: `specs/001-chromix-sort-mvp`  
**Date**: 2026-04-11

## Prerequisites

- A modern browser (see [research.md](./research.md) R3).
- Once `chromix-sort-dlp/index.html` exists: a **local static server** is recommended for ES modules.

## Run locally

From the repository root:

```bash
cd chromix-sort-dlp
python3 -m http.server 8080
```

Open `http://localhost:8080/` (or the path printed by the server).

Equivalent: `npx --yes serve .` inside `chromix-sort-dlp/`.

## Manual verification (minimum)

Complete this matrix after implementation; record pass/fail in PR or demo notes.

| # | Case | Steps | Expected |
|---|------|-------|----------|
| 1 | Valid move | Select source with top piece, select legal dest | Top piece moves; move count +1 |
| 2 | Empty source | Select empty tube as source, then any dest | No board change; teaches “nothing to move” |
| 3 | Full destination | Fill dest to capacity, try valid color | No change; teaches “no space” |
| 4 | Color clash | Dest non-empty top differs from source top | No change; teaches color rule |
| 5 | Win | Solve configured layout | Victory UI + move count (and time if shown) |
| 6 | Reset (playing) | Mid-game, press reset | Initial layout; counters 0 |
| 7 | Reset (won) | From victory, press reset | Same as row 6 |
| 8 | Keyboard | Tab/arrow + activate per `contracts/ui-accessibility.md` | Same outcomes as pointer for rows 1–4 |
| 9 | Mobile width | Narrow viewport (~390px) | Board + reset visible; no broken layout |
|10 | Rapid clicks | Spam click during move | No impossible stacks vs. model |

## Optional automated checks

If `js/rules.js` exposes pure functions, from repo root (after adding a minimal Node test harness):

```bash
node --test
```

(Exact command depends on chosen test file layout during implementation.)
