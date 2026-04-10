/**
 * Chromix Sort — application entry (Phase 1: shell only).
 * Wires to config, state, view, and input modules in later tasks.
 */

import "./config.js";
import "./state.js";
import "./view.js";
import "./input.js";

function bootstrap() {
  const root = document.getElementById("game-root");
  if (!root) return;

  root.dataset.chromixPhase = "1";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
