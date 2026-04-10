<!--
  SYNC IMPACT REPORT
  Version: (unreleased template) → 1.0.0
  Modified principles: n/a (initial adoption)
  Added sections: Core Principles (5), MVP & academic deliverable, Spec Kit alignment, Governance
  Removed sections: none
  Templates: .specify/templates/plan-template.md ✅ updated (Constitution Check gates)
            .specify/templates/spec-template.md ✅ reviewed (no change required)
            .specify/templates/tasks-template.md ✅ reviewed (no change required)
            .specify/templates/commands/*.md — n/a (directory not present)
  Follow-up: none
-->

# Chromix Sort Constitution

## Core Principles

### I. Documentation and spec authority

Product definition, functional specification, and technical design are authoritative for **what** the game is and **what** “done” means. Spec Kit artifacts (`spec.md`, `plan.md`, `tasks.md`) MUST stay consistent with those documents. Any change to puzzle rules, MVP scope, or stack constraints MUST be reflected in the written specs before implementation is treated as complete.

### II. Static client-only MVP (NON-NEGOTIABLE for baseline)

The deliverable MUST run as **static web assets** in a modern browser: HTML, CSS, and JavaScript only. There MUST be no mandatory backend service, database, or authentication for the baseline MVP unless this constitution is explicitly amended and versioned. Optional hosting of static files is allowed.

### III. Domain model authority

**Game state is the single source of truth.** A dedicated rule layer validates moves and produces the next state (or a typed rejection). The presentation layer MUST reflect the model and forward user intent; it MUST NOT encode divergent rules or hidden state that the model does not represent.

### IV. Testable rules and outcomes

Core puzzle behavior (valid/invalid moves, win detection, reset to initial layout) MUST be **verifiable**. At minimum, the plan and tasks MUST include a defined verification approach (e.g., manual test matrix, scripted checks). Where automated tests exist, they SHOULD cover pure rule logic first.

### V. Accessible, instructive UX

The experience MUST remain usable on common desktop and mobile viewports. Where applicable, support **keyboard or non-pointer** interaction for game actions. Feedback for invalid actions MUST **teach the rule** briefly, not only block the player.

The UI SHOULD aim to be visually polished and presentation-ready, with clear color differentiation, smooth feedback on interactions, and an overall aesthetic suitable for academic demonstration.

## MVP scope and academic deliverable

The MVP targets a **small, polished** puzzle surface: scenarios and metrics (e.g., moves, time) appropriate to a master’s presentation, not a large content catalog. Features outside documented MVP (online competition, accounts, monetization) require explicit product/spec updates and constitution review if they imply stack or governance changes.

## Spec Kit workflow alignment

Implementation planning MUST complete the **Constitution Check** in `plan.md` before Phase 0 research and re-validate it after Phase 1 design. Violations MUST be recorded in **Complexity Tracking** with justification. Execution SHOULD follow the ordered, dependency-aware breakdown in `tasks.md` once generated.

## Definition of Done

A feature or MVP increment is considered complete when:

- The behavior is fully aligned with the functional specification
- All game rules are correctly enforced (valid/invalid moves, win condition, reset)
- The UI accurately reflects the game state at all times
- No console errors are present during normal gameplay
- The game is playable end-to-end in a modern browser without setup
- Basic usability is validated (clear interactions, understandable feedback)
- The implementation remains consistent with the Technical Design
- The game provides a visually clear and consistent experience suitable for presentation/demo

Optional (if applicable):
- Core logic is manually or automatically verified
- UX feedback improves player understanding of the rules

## Governance

This constitution supersedes informal or ad hoc practices when they conflict. **Amendments** require updating `.specify/memory/constitution.md`, incrementing **CONSTITUTION_VERSION** under semantic versioning (MAJOR for incompatible governance or removed principles; MINOR for new principles or material guidance; PATCH for clarifications only), and updating **Last Amended**. Reviews of changes that affect gameplay or architecture SHOULD confirm compliance with Core Principles. Runtime coding style MAY be further guided by team conventions and `README` / course materials, but MUST NOT contradict this document.

**Version**: 1.0.0 | **Ratified**: 2026-04-11 | **Last Amended**: 2026-04-11