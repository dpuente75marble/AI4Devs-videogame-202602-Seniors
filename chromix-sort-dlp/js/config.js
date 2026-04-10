/**
 * MVP board definition (read-only).
 * Each tube: capacity + initialPieces ordered bottom → top (index 0 = bottom of tube).
 *
 * Layout: 2 colors × 4 pieces, 4 tubes × capacity 4, 2 working tubes empty.
 * Classic ball-sort pattern; solvable by moving only top pieces onto matching or empty tubes.
 */

/** @typedef {string} ColorId */

/**
 * @typedef {{ capacity: number, initialPieces: ColorId[] }} TubeConfig
 */

/** @type {{ tubes: TubeConfig[] }} */
export const MVP_CONFIG = {
  tubes: [
    { capacity: 4, initialPieces: ["red", "blue", "red", "blue"] },
    { capacity: 4, initialPieces: ["blue", "red", "blue", "red"] },
    { capacity: 4, initialPieces: [] },
    { capacity: 4, initialPieces: [] },
  ],
};
