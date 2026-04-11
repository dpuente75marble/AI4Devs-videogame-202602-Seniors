/**
 * Chromix Sort — wires config, state, view, and pointer input.
 */

import { MVP_CONFIG } from "./config.js";
import { createInitialState, resetToDefault, applyMove } from "./state.js";
import { render, violationMessage } from "./view.js";
import { attachPointerControls } from "./input.js";

/** @type {object} */
let gameState = createInitialState(MVP_CONFIG);

/** Shown until cleared by a new action (valid move, new selection, reset). */
let transientErrorHint = null;

/** Blocks rapid double-clicks while the UI settles after a successful move. */
let inputLockedUntil = 0;

const INPUT_LOCK_MS = 200;

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

/**
 * @param {object} next
 * @param {{ clearError?: boolean, lockInputMs?: number }} [opts]
 */
function commit(next, opts = {}) {
  if (opts.clearError) {
    transientErrorHint = null;
  }
  gameState = next;
  const els = getElements();
  if (els) {
    render(gameState, els, { errorHint: transientErrorHint });
  }
  if (opts.lockInputMs) {
    inputLockedUntil = performance.now() + opts.lockInputMs;
  }
}

function bootstrap() {
  const els = getElements();
  if (!els) return;

  transientErrorHint = null;
  render(gameState, els, { errorHint: null });

  attachPointerControls(els.tubesRoot, {
    isInteractionLocked: () => performance.now() < inputLockedUntil,
    onTubeClick(index) {
      const s = gameState;
      if (s.phase !== "playing") return;

      if (s.selection.type === "none") {
        transientErrorHint = null;
        commit({ ...s, selection: { type: "source", tubeIndex: index } });
        return;
      }

      const from = s.selection.tubeIndex;
      if (from === index) {
        transientErrorHint = null;
        commit({ ...s, selection: { type: "none" } });
        return;
      }

      const result = applyMove(s, from, index);
      if (!result.ok) {
        transientErrorHint = violationMessage(result.reason);
        commit({
          ...result.state,
          selection: { type: "none" },
        });
        return;
      }

      transientErrorHint = null;
      commit(result.state, { lockInputMs: INPUT_LOCK_MS });
    },
  });

  els.resetBtn.addEventListener("click", () => {
    transientErrorHint = null;
    inputLockedUntil = 0;
    commit(resetToDefault(), { clearError: true });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
