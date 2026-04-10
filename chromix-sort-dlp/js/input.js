/**
 * Pointer input: delegates tube activation to the app (main). No board mutation here.
 */

/**
 * @param {HTMLElement} tubesRoot
 * @param {{ onTubeClick: (index: number) => void }} handlers
 */
export function attachPointerControls(tubesRoot, { onTubeClick }) {
  tubesRoot.addEventListener("click", (event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    const tubeBtn = target.closest("[data-tube-index]");
    if (!tubeBtn || !(tubeBtn instanceof HTMLButtonElement)) return;
    if (tubeBtn.disabled) return;
    const raw = tubeBtn.dataset.tubeIndex;
    const index = raw !== undefined ? Number.parseInt(raw, 10) : NaN;
    if (!Number.isInteger(index) || index < 0) return;
    onTubeClick(index);
  });
}
