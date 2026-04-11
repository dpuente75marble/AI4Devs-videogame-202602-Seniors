/**
 * Renders GameState to the DOM. No rule logic — display only.
 */

/** CSS maps colors via .tube__piece--{id}; extend styles.css when adding colors. */
const KNOWN_PIECE_COLORS = new Set([
  "red",
  "blue",
  "mint",
  "peach",
  "lavender",
  "sky",
  "yellow",
  "pink",
]);

/** @type {Record<string, string>} */
const VIOLATION_MESSAGES = {
  SOURCE_EMPTY: "No pieces to move",
  DEST_FULL: "Destination is full",
  COLOR_MISMATCH: "Colors must match",
  SAME_TUBE: "Pick a different tube to pour into.",
  INVALID_INDEX: "That tube is not available.",
  GAME_LOCKED: "The puzzle is already solved. Press Reset to play again.",
};

/**
 * @param {string} code Rule violation code from rules.Violation
 * @returns {string}
 */
export function violationMessage(code) {
  return VIOLATION_MESSAGES[code] ?? "That move breaks the rules — try another.";
}

/**
 * @param {object} state GameState from state.js (board, phase, selection, metrics)
 * @param {{
 *   boardEl: HTMLElement,
 *   tubesRoot: HTMLElement,
 *   statusEl: HTMLElement,
 *   resetBtn: HTMLButtonElement,
 * }} elements
 * @param {{ errorHint?: string | null }} [options]
 */
export function render(state, elements, options = {}) {
  const { boardEl, tubesRoot, statusEl, resetBtn } = elements;
  const errorHint = options.errorHint ?? null;

  tubesRoot.removeAttribute("aria-hidden");

  tubesRoot.replaceChildren();

  state.board.tubes.forEach((tube, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tube";
    btn.dataset.tubeIndex = String(index);

    const isSource =
      state.selection.type === "source" && state.selection.tubeIndex === index;
    if (isSource) {
      btn.classList.add("tube--selected");
    }

    if (state.phase !== "playing") {
      btn.disabled = true;
    }

    const used = tube.pieces.length;
    let label = `Tube ${index + 1}, ${used} of ${tube.capacity} pieces`;
    if (isSource) {
      label += ", selected as source";
    }
    btn.setAttribute("aria-label", label);
    btn.setAttribute("aria-pressed", isSource ? "true" : "false");

    const stack = document.createElement("div");
    stack.className = "tube__stack";
    stack.setAttribute("aria-hidden", "true");

    for (const piece of tube.pieces) {
      const el = document.createElement("div");
      const safe = /^[a-z0-9_-]+$/i.test(piece.color) ? piece.color.toLowerCase() : "";
      const mod = safe && KNOWN_PIECE_COLORS.has(safe) ? safe : "unknown";
      el.className = `tube__piece tube__piece--${mod}`;
      el.dataset.color = piece.color;
      stack.appendChild(el);
    }

    const emptySlots = tube.capacity - used;
    for (let i = 0; i < emptySlots; i++) {
      const el = document.createElement("div");
      el.className = "tube__empty";
      stack.appendChild(el);
    }

    btn.appendChild(stack);
    tubesRoot.appendChild(btn);
  });

  statusEl.classList.remove("status--placeholder", "status--error", "status--success");

  let announcement = "";
  if (state.phase === "won") {
    statusEl.classList.add("status--success");
    announcement = `Puzzle solved! You finished in ${state.metrics.moveCount} moves. Press Reset to play again.`;
  } else {
    const moves = `Moves: ${state.metrics.moveCount}`;
    if (errorHint) {
      statusEl.classList.add("status--error");
      announcement = `${moves}. ${errorHint}`;
    } else {
      announcement = moves;
      if (state.selection.type === "none") {
        announcement += " — Select a tube to move from.";
      } else {
        announcement += " — Select a tube to pour into.";
      }
    }
  }

  statusEl.textContent = announcement;
  statusEl.setAttribute("role", errorHint && state.phase === "playing" ? "alert" : "status");

  const gameRoot = document.getElementById("game-root");
  if (gameRoot) {
    let ui = "idle";
    if (state.phase === "won") ui = "won";
    else if (errorHint) ui = "error";
    else if (state.selection.type === "source") ui = "source";
    gameRoot.dataset.chromixUi = ui;
  }

  resetBtn.disabled = false;
  resetBtn.setAttribute(
    "aria-label",
    "Restart level — restore the puzzle to its starting layout"
  );
}
