/**
 * Chromix Sort — wires config, state, view, and pointer input.
 */

import { MVP_CONFIG } from "./config.js";
import { createInitialState, resetToDefault, applyMove } from "./state.js";
import { render } from "./view.js";
import { attachPointerControls } from "./input.js";

/** @type {object} */
let gameState = createInitialState(MVP_CONFIG);

function getElements() {
  const boardEl = document.getElementById("board");
  const tubesRoot = document.getElementById("tubes");
  const statusEl = document.getElementById("status");
  const resetBtn = document.querySelector("#btn-reset");
  if (
    !boardEl ||
    !tubesRoot ||
    !statusEl ||
    !(resetBtn instanceof HTMLButtonElement)
  ) {
    return null;
  }
  return {
    boardEl,
    tubesRoot,
    statusEl,
    resetBtn,
  };
}

function commit(next) {
  gameState = next;
  const els = getElements();
  if (els) render(gameState, els);
}

function bootstrap() {
  const els = getElements();
  if (!els) return;

  const root = document.getElementById("game-root");
  if (root) root.dataset.chromixPhase = "3";

  render(gameState, els);

  attachPointerControls(els.tubesRoot, {
    onTubeClick(index) {
      const s = gameState;
      if (s.phase !== "playing") return;

      if (s.selection.type === "none") {
        commit({ ...s, selection: { type: "source", tubeIndex: index } });
        return;
      }

      const from = s.selection.tubeIndex;
      if (from === index) {
        commit({ ...s, selection: { type: "none" } });
        return;
      }

      const result = applyMove(s, from, index);
      commit(result.state);
    },
  });

  els.resetBtn.addEventListener("click", () => {
    commit(resetToDefault());
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
