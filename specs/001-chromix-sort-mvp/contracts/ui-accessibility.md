# Contract: UI, responsiveness, and accessibility

**Feature**: `specs/001-chromix-sort-mvp`  
**Date**: 2026-04-11

## DOM / presentation responsibilities

- **Tubes**: Each tube is an interactive region (e.g., `button` or focusable `div` with `role="button"` and `tabindex="0"`) with visible focus ring.
- **Reset**: Native `button` with clear accessible name (e.g., “Restart level”).
- **Status region**: Live feedback for errors and victory (`role="status"` or `role="alert"` for urgent errors—pick one pattern and stay consistent).
- **Victory overlay**: Trap focus optional; must expose reset and announce completion to screen readers.

## Pointer flow

1. First click/tap: select **source** (highlight).  
2. Second click/tap on **different** tube: treat as **destination** and invoke `tryMove`.  
3. Second click on **same** tube: cancel selection (recommended) or no-op—must match spec edge case and must not remove pieces.

## Keyboard flow (minimum)

- **Tab**: Move focus between tubes and reset.  
- **Enter / Space**: Activate focused tube using the same two-step semantics as pointer.  
- Document any **arrow-key** shortcut (e.g., move focus between tubes) in `README` or in-game hints if implemented.

All keyboard paths must call the same controller entry points as pointer paths (see [core-game-api.md](./core-game-api.md)).

## Responsive

- At a narrow viewport (see [quickstart.md](../quickstart.md)), the full set of tubes and reset remain visible without horizontal clipping of the main play area; font and tube sizing may scale down.

## Visual / polish

- Distinct colors per `ColorId` with non-color cue where feasible (e.g., subtle pattern or label) to support low color vision when practical within MVP scope.
- Transitions are cosmetic; model updates remain synchronous per [research.md](../research.md) R4.
