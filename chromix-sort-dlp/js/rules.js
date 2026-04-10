/**
 * Pure puzzle rules — no DOM, no I/O.
 */

/** @typedef {{ color: string }} Piece */
/** @typedef {{ capacity: number, pieces: Piece[] }} Tube */
/** @typedef {{ tubes: Tube[] }} Board */

/**
 * @typedef {{
 *   board: Board,
 *   phase: 'playing' | 'won',
 *   selection: { type: 'none' } | { type: 'source', tubeIndex: number },
 *   metrics: { moveCount: number, startedAt: number },
 *   feedback?: { messageKey?: string, message?: string, severity?: 'error' | 'info' }
 * }} GameState
 */

export const Violation = Object.freeze({
  SOURCE_EMPTY: "SOURCE_EMPTY",
  DEST_FULL: "DEST_FULL",
  COLOR_MISMATCH: "COLOR_MISMATCH",
  SAME_TUBE: "SAME_TUBE",
  INVALID_INDEX: "INVALID_INDEX",
  GAME_LOCKED: "GAME_LOCKED",
});

/**
 * @param {Board} board
 * @returns {boolean}
 */
export function checkWin(board) {
  return board.tubes.every((tube) => {
    if (tube.pieces.length === 0) return true;
    const first = tube.pieces[0].color;
    return tube.pieces.every((p) => p.color === first);
  });
}

/**
 * @param {GameState} state
 * @returns {GameState}
 */
function cloneState(state) {
  return {
    board: cloneBoard(state.board),
    phase: state.phase,
    selection:
      state.selection.type === "none"
        ? { type: "none" }
        : { type: "source", tubeIndex: state.selection.tubeIndex },
    metrics: { moveCount: state.metrics.moveCount, startedAt: state.metrics.startedAt },
    feedback: state.feedback ? { ...state.feedback } : undefined,
  };
}

/**
 * @param {Board} board
 * @returns {Board}
 */
function cloneBoard(board) {
  return {
    tubes: board.tubes.map((t) => ({
      capacity: t.capacity,
      pieces: t.pieces.map((p) => ({ color: p.color })),
    })),
  };
}

/**
 * @param {number} index
 * @param {Board} board
 * @returns {boolean}
 */
function validTubeIndex(index, board) {
  return Number.isInteger(index) && index >= 0 && index < board.tubes.length;
}

/**
 * Attempt to move the top piece from `fromIndex` to `toIndex`.
 * Never mutates `state`; returns a fresh GameState on both success and failure.
 *
 * @param {GameState} state
 * @param {number} fromIndex
 * @param {number} toIndex
 * @returns {{ ok: true, state: GameState } | { ok: false, reason: string, state: GameState }}
 */
export function tryMove(state, fromIndex, toIndex) {
  const snapshot = cloneState(state);

  if (state.phase !== "playing") {
    return { ok: false, reason: Violation.GAME_LOCKED, state: snapshot };
  }

  if (!validTubeIndex(fromIndex, state.board) || !validTubeIndex(toIndex, state.board)) {
    return { ok: false, reason: Violation.INVALID_INDEX, state: snapshot };
  }

  if (fromIndex === toIndex) {
    return { ok: false, reason: Violation.SAME_TUBE, state: snapshot };
  }

  const board = cloneBoard(state.board);
  const source = board.tubes[fromIndex];
  const dest = board.tubes[toIndex];

  if (source.pieces.length === 0) {
    return { ok: false, reason: Violation.SOURCE_EMPTY, state: snapshot };
  }

  const moving = source.pieces[source.pieces.length - 1];

  if (dest.pieces.length >= dest.capacity) {
    return { ok: false, reason: Violation.DEST_FULL, state: snapshot };
  }

  if (dest.pieces.length > 0) {
    const destTop = dest.pieces[dest.pieces.length - 1];
    if (destTop.color !== moving.color) {
      return { ok: false, reason: Violation.COLOR_MISMATCH, state: snapshot };
    }
  }

  source.pieces.pop();
  dest.pieces.push(moving);

  const next = cloneState(state);
  next.board = board;
  next.selection = { type: "none" };
  next.metrics = {
    moveCount: state.metrics.moveCount + 1,
    startedAt: state.metrics.startedAt,
  };
  next.feedback = undefined;
  next.phase = checkWin(board) ? "won" : "playing";

  return { ok: true, state: next };
}
