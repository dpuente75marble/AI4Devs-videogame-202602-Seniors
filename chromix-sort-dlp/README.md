# Chromix Sort (MVP)

Single-page puzzle: sort colored pieces into tubes using only **HTML, CSS, and JavaScript** (no backend, no persistence).

## Run locally

ES modules require a local HTTP server (avoid opening `index.html` as `file://`).

```bash
cd chromix-sort-dlp
python3 -m http.server 8080
```

Open `http://localhost:8080/`.

## Play

1. Click a tube to select the **source** (top piece moves).
2. Click another tube as **destination** (must have space; color must match the top of the stack or be empty).
3. Use **Reset** to restore the starting layout and move count.

Invalid moves show a short message in the status area; the puzzle locks tubes when solved until you reset.

## Docs

- Product / rules / architecture: see `docs/` in this folder.
- Spec Kit feature: `../specs/001-chromix-sort-mvp/` (repo-relative).

## Verification

Manual checks are listed in `../specs/001-chromix-sort-mvp/quickstart.md`.
