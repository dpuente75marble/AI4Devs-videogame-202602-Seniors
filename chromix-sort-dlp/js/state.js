/**
 * Game state factory and move orchestration (delegates rules to rules.js).
 */

import { MVP_CONFIG } from "./config.js";
import { tryMove as rulesTryMove, checkWin } from "./rules.js";

export { checkWin, Violation } from "./rules.js";

/**
 * @param {{ tubes: { capacity: number, initialPieces: string[] }[] }} config
 */
function boardFromConfig(config) {
  return {
    tubes: config.tubes.map((t) => ({
      capacity: t.capacity,
      pieces: t.initialPieces.map((color) => ({ color })),
    })),
  };
}

/**
 * @param {{ tubes: { capacity: number, initialPieces: string[] }[] }} config
 */
export function createInitialState(config) {
  return {
    board: boardFromConfig(config),
    phase: /** @type {const} */ ("playing"),
    selection: /** @type {const} */ ({ type: "none" }),
    metrics: {
      moveCount: 0,
      startedAt: typeof performance !== "undefined" ? performance.now() : Date.now(),
    },
    feedback: undefined,
  };
}

/**
 * @param {{ tubes: { capacity: number, initialPieces: string[] }[] }} config
 */
export function reset(config) {
  return createInitialState(config);
}

/**
 * @param {object} state from createInitialState / reset / prior applyMove result
 * @param {number} fromIndex
 * @param {number} toIndex
 */
export function applyMove(state, fromIndex, toIndex) {
  return rulesTryMove(state, fromIndex, toIndex);
}

/** Default session using exported MVP_CONFIG (convenience for main.js later). */
export function createDefaultState() {
  return createInitialState(MVP_CONFIG);
}

export function resetToDefault() {
  return reset(MVP_CONFIG);
}
