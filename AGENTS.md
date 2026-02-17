# AGENTS.md

## Project Overview
- Repository: Angular TicTacToe app (`myapp`) with a rebuilt Angular runtime/config scaffold.
- Angular version: `~10.1.x` (from `package.json`).
- UI stack: SCSS-driven custom UI (Nebular packages exist in dependencies but current UI does not use Nebular components).
- Main source footprint:
  - `src/app/board/*` (game logic, board UI, tests)
  - `src/app/app.component.*`
  - `src/app/app.module.ts`
  - `src/main.ts`, `src/polyfills.ts`, `src/styles.scss`
  - `src/environments/*`
  - Angular workspace config (`angular.json`, `tsconfig*.json`, `karma.conf.js`, `tslint.json`)

## Current State (Important)
- Game is self-contained in `BoardComponent`; there is no child `SquareComponent`.
- Features implemented:
  - winner detection + winning line highlight
  - draw detection
  - move history with jump/undo/redo
  - round restart and scoreboard reset
  - round/session scoreboard (`X`, `O`, `draws`)
- `dist/` is a generated artifact snapshot; treat it as build output unless explicitly asked to edit it.

## Core Behavior
- Game state lives in `BoardComponent`:
  - `squares: ('X' | 'O' | null)[]`
  - `moveHistory: ('X' | 'O' | null)[][]`
  - `moveIndex: number`
  - `xIsNext: boolean`
  - `winner: 'X' | 'O' | null`
  - `isDraw: boolean`
  - `scores: { X: number; O: number; draws: number }`
- `startNewRound()` resets board state while keeping scoreboard.
- `resetScoreboard()` clears scoreboard and starts a fresh round.
- `makeMove(index)` writes only valid moves, updates history, and evaluates winner/draw.
- `jumpTo`, `undo`, `redo` navigate history without mutating scores.
- `calculateWinner(board)` checks 8 classic TicTacToe win lines.

## Working Rules For Agents
- Prefer minimal, targeted edits in `src/app/board/` for gameplay changes and `src/app/app.component.*` for shell/layout changes.
- Preserve current game semantics unless asked to change behavior:
  - Cannot overwrite occupied squares.
  - No moves allowed after win/draw until round reset.
  - Winner/draw is recalculated on each state transition.
- Keep logic in component methods and maintain/expand test coverage in `src/app/board/board.component.spec.ts`.
- Do not modify `dist/` unless user explicitly requests generated artifact updates.

## Validation
- Primary checks:
  - `npm run build`
  - `npm run test -- --watch=false --browsers=ChromeHeadless`
- If dependency install is unavailable (for example offline/no registry access), report command failures with exact error and rely on static review.

## Suggested Next Improvements (Optional)
- Upgrade Angular/tooling from v10 to a current supported major version.
- Add keyboard navigation and richer ARIA announcements for accessibility.
- Extract pure game logic into a dedicated service or utility for simpler unit testing.
