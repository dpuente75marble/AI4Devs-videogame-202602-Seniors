/**
 * Renders GameState to the DOM. No rule logic — display only.
 */

const PIECE_FILL = {
  red: "#e05555",
  blue: "#4db8e8",
};

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

  boardEl.classList.remove("board--placeholder");
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
    stack.style.cssText =
      "display:flex;flex-direction:column-reverse;flex:1;width:100%;min-height:0;padding:4px;gap:3px;";

    for (const piece of tube.pieces) {
      const el = document.createElement("div");
      el.className = "tube__piece";
      el.style.cssText =
        "flex:1 1 0;min-height:0;border-radius:8px;transition:transform 0.12s ease;" +
        `background:${PIECE_FILL[piece.color] ?? "#888"};` +
        "box-shadow:inset 0 -2px 0 rgba(0,0,0,0.2);";
      stack.appendChild(el);
    }

    const emptySlots = tube.capacity - used;
    for (let i = 0; i < emptySlots; i++) {
      const el = document.createElement("div");
      el.className = "tube__empty";
      el.style.cssText =
        "flex:1 1 0;min-height:0;border-radius:8px;border:1px dashed rgba(255,255,255,0.15);";
      stack.appendChild(el);
    }

    btn.style.display = "flex";
    btn.style.flexDirection = "column";
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

  resetBtn.disabled = false;
  resetBtn.setAttribute("aria-label", "Reset puzzle to the starting layout");
}
