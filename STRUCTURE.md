# Debug Arena — Structure

- `client/src/App.tsx`: Single-page product shell, state machine for home/game/leaderboard, question bank, timer, scoring, and UI components.
- `client/src/index.css`: Design tokens, typography, ambient background, code-window, answer cards, and responsive styling.
- `client/index.html`: Metadata and font loading entry point.
- `PLAN.md`: Product intent and verification criteria.
- `STRUCTURE.md`: This architecture reference.

## Deferred next slice
Move question content and score persistence into a `web-db-user` backend. Add educator/admin views for creating question banks, reviewing attempts, and resetting leaderboard data. Keep the current client flow as the presentation layer.
