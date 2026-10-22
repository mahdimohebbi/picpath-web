# PicPath Web

Offline-capable, mobile-first picture-puzzle PWA with a Duolingo-style level path.

## Stack (do not deviate)
Vite + React 18 + TypeScript strict · CSS modules + CSS variables (no UI lib) · Zustand (persist → localStorage) ·
React Router (HashRouter) · vite-plugin-pwa · Vitest · tap-to-select input everywhere (jigsaw: tap piece, then tap cell; no drag) · DOM tiles with `background-position`.
No backend, ads, analytics, or extra libraries unless essential.

## Architecture
- `src/theme.css` — "sticker & ink" tokens: role colors (`--primary` coral, `--accent` teal, `--star`, `--danger`), `--edge`/`--shadow` + `--outline`/`--pop`; dark mode via `prefers-color-scheme`. Font: Fredoka. Keep it visually distinct from Duolingo
- `src/components/` — PopButton, PathNode, TopStats, Mascot, Confetti, Shell, BottomNav, Icons (file + `.module.css`)
- `src/components/boards/` — JigsawBoard, SwapBoard, SlidingBoard; share `BoardProps`/`BoardHandle` (hint)
- `src/lib/` — feedback (sound + vibrate), sound (WebAudio synth), useImage, useCountUp
- `src/screens/` — Path, Game, Result, Gallery, Profile
- `src/game/` — pure engines, no React: `engine.ts` (types, stars, xp), `jigsaw.ts`, `swap.ts`, `sliding.ts`, `rng.ts`
- `src/store/progress.ts` — Zustand persisted store (xp, stars, hearts, streak)
- `src/data/levels.json` — 5 units × 6 levels; level 6 = boss; `levels.ts` = selectors/unlock rules
- `src/store/meta.ts` — pure hearts regen + streak helpers (tested)
- `public/puzzles/pNN.webp` — 30 images (picsum IDs in `CREDITS.md`)

## Rules
- Vite `base: '/picpath-web/'`; asset URLs via `import.meta.env.BASE_URL`.
- After every step: `npm run build` and `npm test -- --run` pass, then Conventional Commit + `git push`.
- Deploy: `.github/workflows/deploy.yml` → GitHub Pages on push to main.
- Sliding shuffle = random legal moves from solved (always solvable).
- Engines are unit-tested (shuffle solvability, win detection, stars).

## Token efficiency
- Don't re-read files just written; make targeted edits, not rewrites.
- Run build/test quietly; show only error lines.
- After each phase: 2–3 line summary + commit hash.
- Ask the user only when blocked.
