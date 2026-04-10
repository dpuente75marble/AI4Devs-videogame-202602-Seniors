# Feature Specification: Chromix Sort MVP

**Feature Branch**: `001-chromix-sort-mvp`  
**Created**: 2026-04-11  
**Status**: Draft  
**Input**: User description: "Implement the Chromix Sort MVP as a single-player web puzzle game with a single preconfigured board. The player must sort colored pieces into tubes so that each tube contains only one color or is empty. The game must run entirely in the browser using only HTML, CSS, and JavaScript, with no backend, no authentication, and no persistence. The MVP must include board rendering, source/destination tube selection, movement validation, invalid-move feedback, move counter, reset action, win detection, victory message, responsive layout, and a visually polished presentation suitable for an academic demo. The game state must be the single source of truth, with rule validation separated from the UI layer, following the existing product-definition, functional-spec, technical-design, and constitution documents already created in the project."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Play the puzzle on one fixed board (Priority: P1)

A player opens the game and sees a single preconfigured board: several tubes with colored pieces stacked inside. They select a source tube and a destination tube to move pieces according to the rules until the puzzle is solved or they choose to reset.

**Why this priority**: Without a playable loop (see board → select → move → updated board), there is no product.

**Independent Test**: Load the experience, perform only valid moves from the documented MVP layout until the win condition is met, without using reset or victory UI beyond basic progression.

**Acceptance Scenarios**:

1. **Given** the MVP initial layout, **When** the player completes a valid source-then-destination selection, **Then** the top piece from the source moves to the destination and the board updates immediately.
2. **Given** an empty source tube, **When** the player tries to use it as origin, **Then** the move is rejected and the board does not change.
3. **Given** the destination has no free slot, **When** the player attempts a move into it, **Then** the move is rejected and the board does not change.
4. **Given** the destination is non-empty and its top piece is a different color than the moving piece, **When** the player attempts the move, **Then** the move is rejected and the board does not change.

---

### User Story 2 - Understand mistakes through clear feedback (Priority: P2)

When a move is not allowed, the player sees a short message that explains which rule failed, not only that the action was blocked.

**Why this priority**: Teaching the rules through feedback is a core product promise and reduces frustration on a single-level MVP without a long tutorial.

**Independent Test**: Trigger each major rejection reason (empty source, full destination, color mismatch) and confirm messaging references the violated condition in plain language.

**Acceptance Scenarios**:

1. **Given** an invalid move attempt, **When** the game rejects it, **Then** the board state is identical to the state before the attempt.
2. **Given** an invalid move attempt, **When** the game rejects it, **Then** the player sees feedback that states or implies the rule that was broken (e.g., destination full, wrong color, nothing to move).

---

### User Story 3 - Finish, celebrate, and restart (Priority: P2)

When the win condition is met, the player sees a clear victory state with session summary (at minimum move count; elapsed play time included if the session tracks it). They can reset the board to the same initial layout and zeroed session metrics.

**Why this priority**: Completing the loop (win detection + restart) makes the MVP demonstrable and repeatable for academic presentation.

**Independent Test**: Reach the solved state from the MVP layout, read the victory summary, then reset and confirm layout and counters match a fresh session.

**Acceptance Scenarios**:

1. **Given** every tube is either empty or contains pieces of a single color only (per MVP rules), **When** the last valid change completes that state, **Then** the game enters a completed state and shows a victory message.
2. **Given** the victory state, **When** the player chooses reset, **Then** the board returns to the documented initial layout, move count resets, and any shown session timer resets if present.
3. **Given** play in progress, **When** the player chooses reset, **Then** the same restoration and counter reset as in the previous scenario occurs.

---

### User Story 4 - Play on common devices with pointer or keyboard (Priority: P3)

The same puzzle can be played on typical desktop and mobile viewports: layout remains usable, controls remain reachable, and every action needed to finish the level is available with pointer or with keyboard (or equivalent non-pointer input agreed for implementation).

**Why this priority**: Constitution and functional spec require inclusive interaction and responsive presentation for real-world demos.

**Independent Test**: Complete one full win path using only pointer, then repeat using only keyboard navigation and activation on a narrow viewport width.

**Acceptance Scenarios**:

1. **Given** a mobile-sized viewport, **When** the board is displayed, **Then** tubes, pieces, and essential controls (including reset) remain visible and legible without horizontal clipping of the main play area.
2. **Given** keyboard focus on a tube control, **When** the user activates it according to the documented two-step flow, **Then** the same outcomes occur as with pointer-based selection of source and destination.

---

### Edge Cases

- Player selects the same tube as source and destination: treat as invalid or cancel per UX; board must stay consistent with rule outcomes (no duplicate removal of pieces).
- Player changes mind after selecting a source: interaction model allows clearing or changing the pending source without applying a move.
- Rapid repeated clicks or key presses during a short visual transition: input behavior must not produce an impossible board (capacity exceeded, wrong counts, or divergent “hidden” layout vs. authoritative state).
- Page reload or new visit: a new session starts from the same MVP initial layout; no recovery of the previous in-progress game.
- Victory state: optional limitation of further moves is acceptable if reset remains available and clearly discoverable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The game MUST present exactly one fixed MVP board on load, including a defined number of tubes, each with a maximum capacity visible to the player, and an initial stack of colored pieces per tube matching the documented MVP layout.
- **FR-002**: Each piece color MUST be distinguishable from other colors used on the board and MUST keep the same meaning everywhere it appears.
- **FR-003**: The player MUST be able to complete the full flow (select source tube, select destination tube, apply or reject move) using the primary interaction model defined for the MVP.
- **FR-004**: On each move attempt, the game MUST evaluate validity against the rules: only the top piece of the source may move; destination must have free capacity; destination must be empty or its top piece must match the moving piece’s color.
- **FR-005**: On a valid move, the game MUST update authoritative game state immediately so that source and destination stacks reflect the move, then refresh the presentation from that state.
- **FR-006**: On an invalid move, the game MUST leave authoritative state unchanged and MUST show brief feedback that teaches which condition failed.
- **FR-007**: The game MUST maintain a move counter for the current session, incremented only on successful moves.
- **FR-008**: The game MUST detect victory when every tube is empty or monochromatic (no mixed colors in any tube), consistent with the MVP definition.
- **FR-009**: Upon victory, the game MUST show a clear completion message and MUST include at least the session move count in the summary; if elapsed time is tracked, it MUST appear in the same summary.
- **FR-010**: The player MUST have an explicit reset action from normal play and from victory that restores the MVP initial layout and resets session metrics (moves, time if tracked, selection state, transient error messages).
- **FR-011**: The game MUST run entirely in the user’s browser for a session without requiring authentication, accounts, or a server round-trip to play.
- **FR-012**: The game MUST NOT rely on saving progress across page reloads or visits as part of MVP scope.
- **FR-013**: All actions required to reach victory MUST be available with pointer input OR with keyboard-accessible controls following a documented mapping.
- **FR-014**: Victory, error, and essential control text MUST meet readable contrast against its background per the product’s visual guidelines.
- **FR-015**: Authoritative game state (stacks, phase, session metrics) MUST be the single source of truth; presentation MUST reflect that state and MUST NOT apply rule outcomes that were not produced by the rule evaluation path.

### Key Entities *(include if feature involves data)*

- **Tube**: Ordered stack of pieces from bottom to top; has a maximum capacity; may be empty or partially filled.
- **Piece**: A colored token belonging to exactly one tube at a time; color identity is stable for the session.
- **Game session**: One play-through from load or reset until reload or reset; holds counters and phase (in progress, completed, optionally paused if offered as input lock only).
- **Selection context**: Which tube is currently chosen as source pending destination (or idle); must stay aligned with player-visible highlights.
- **Move result**: Either success with updated stacks or failure with a stable board and a user-facing reason aligned to the broken rule.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A target player from the defined audience can identify the goal (group colors per tube) and complete the first valid move within 2 minutes of opening the game without a tutorial longer than short on-screen copy or equivalent visual hinting.
- **SC-002**: In normal hardware and browser conditions, the player perceives validation and board update after each action within one second (typically felt as immediate).
- **SC-003**: At least 95% of invalid attempts in a structured test matrix (empty source, full destination, illegal color merge) show feedback that names or clearly implies the failed rule, not a generic “invalid” only.
- **SC-004**: On desktop and on a representative mobile viewport width, the full board and reset control remain visible and operable without breaking layout during a complete win path.
- **SC-005**: From the documented MVP start state, a tester can reach victory, read move count at completion, reset, and verify the board and move count match a fresh session start within one minute of interaction.
- **SC-006**: Stakeholders rate the visual presentation as suitable for an academic demonstration (clarity of color coding, spacing, and feedback polish) in a short review checklist.
- **SC-007**: The game logic remains consistent under rapid user interactions (e.g., repeated clicks), with no invalid state transitions or visual desynchronization from the underlying model.

## Assumptions

- Exact tube count, capacities, and color stacks for the MVP board are fixed in project configuration and match the functional specification’s “single board” annex; this spec treats them as given constants for the scenario.
- Optional pause, if present, only blocks input or shows an overlay and does not imply persistence.
- “No persistence” includes avoiding browser storage for game state for the MVP scope described in project technical design.
- Stack and delivery format follow the project constitution: static client-only baseline, no mandatory backend, optional static hosting only.
- Rule evaluation is deterministic: given the same state and the same player action sequence, outcomes are identical.
