# Chromix Sort (MVP)

## Project description

**Chromix Sort** is a **single-player puzzle game** for the web. You move colored pieces between **tubes** (columns) so that each tube ends up **either empty or holding a single color**—a classic “sort the colors” tube puzzle.

This repository contains an **MVP**: one **fixed** board layout, no levels catalog, no accounts, and **no saved progress** between page loads. It is intended as a self-contained browser demo aligned with the project’s product, functional, and technical documentation.

## Tech stack

- **HTML**, **CSS**, and **JavaScript** (ES modules)
- **No backend**, **no database**, **no authentication**

## How to run

The app uses **ES modules** (`import` / `export`). Browsers often block those when the page is opened as a **`file://`** URL, so you should serve the folder over **HTTP** locally.

From the repository, go to this project folder and start a simple static server, for example:

```bash
cd chromix-sort-dlp
python3 -m http.server 8080
```

Then open **http://localhost:8080/** in your browser (adjust host/port if you use another server).

## How to play

1. **Select a source tube** (first click). Only the **top** piece of that tube can move.
2. **Select a destination tube** (second click). The game tries to move the top piece from the source to the destination. (Click the **same** tube again to **cancel** the pending source.)
3. A move is **valid** only if:
   - the source is not empty;
   - the destination has **at least one free slot**;
   - the destination is **empty**, **or** its top piece is the **same color** as the piece you are moving.
4. If the move is **invalid**, the board **does not change** and a **short message** in the status area explains what went wrong (e.g. empty source, full destination, color mismatch).
5. **Goal:** every tube is **empty** or contains pieces of **one color only** (no mixed colors in a tube), in line with the MVP layout.
6. **Reset** restores the **initial** board and session metrics (e.g. move count). After a **win**, further moves are not accepted until you **reset** and start again.

## Documentation

- **Product, rules, and architecture (this deliverable):** `docs/` in this folder  
- **Spec Kit feature pack (spec, plan, tasks, quickstart):** `../specs/001-chromix-sort-mvp/` (relative to this folder)

## Verification

Manual checks are listed in `../specs/001-chromix-sort-mvp/quickstart.md`.
