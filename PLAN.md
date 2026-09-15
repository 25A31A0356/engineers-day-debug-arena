# Debug Arena — Build Plan

## Product slice
A beginner-friendly, 15-minute debugging game with roll-number entry, ten progressive questions, a timer, score calculation, completion state, and a local leaderboard preview.

## Design direction
Dark code-lab interface: Space Grotesk for display hierarchy, DM Mono for code and metadata, electric lime for action/progress, blue ambient light for depth, generous whitespace, and compact responsive panels.

## Risk slices
- Timer lifecycle: interval begins only after a run starts and stops when the run finishes.
- Question progression: answer submission advances through ten missions and records solved question IDs.
- Responsive game workspace: code panel and answer panel collapse cleanly on small widths.
- Leaderboard state: completed run is stored in React state for a local demo; database integration is intentionally deferred.

## Verification criteria
- Home state visibly asks for a roll number and starts a run.
- Game state visibly shows question number, difficulty, code, timer, score, choices, hint, and progress.
- Completion state visibly reports solved count, score, and elapsed time.
- Leaderboard state visibly shows ranked demo data and the current player when available.
- `pnpm check` and production build complete without errors.
