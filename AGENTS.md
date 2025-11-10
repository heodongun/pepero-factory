# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains Next.js route handlers and layouts (e.g., `app/gift/[payload]/page.tsx` for viewing encoded gifts). Use server components by default; opt into `"use client"` only when browser APIs are needed.
- `components/` houses reusable UI such as `gift-share-panel`, `pepero-maker`, and shared primitives under `components/ui/`.
- `lib/` holds pure helpers (`design-utils.tsx`, schema definitions, general utilities). Keep business logic here so UI stays declarative.
- `styles/`, `public/`, and `components.json` provide global Tailwind config, static assets, and the shadcn registry metadata respectively.

## Build, Test, and Development Commands
- `pnpm dev`: start the Next.js dev server with HMR at `http://localhost:3000`.
- `pnpm build`: run `next build`; required for verifying edge/runtime constraints before deploy.
- `pnpm start`: serve the production build locally.
- `pnpm lint`: runs ESLint. Ensure `eslint` is installed (`pnpm add -D eslint`) if the binary is missing.

## Coding Style & Naming Conventions
- TypeScript + React functional components only; enable `"use client"` headers when accessing browser APIs.
- Prefer descriptive camelCase for variables/functions and kebab-case for file names (e.g., `gift-share-panel.tsx`).
- Tailwind CSS drives styling; compose classes with `cn` from `lib/utils`.
- Keep helpers pure and typed; reuse schemas from `lib/design-schema`.

## Testing Guidelines
- No automated test suite exists yet; prioritize manual verification of gift encoding/decoding flows and share links.
- When adding tests, colocate them near the modules they cover (e.g., `lib/__tests__/design-utils.test.ts`) and run via `pnpm test` (add script if introducing a framework such as Vitest).
- Document reproduction steps in PR descriptions until automated coverage lands.

## Commit & Pull Request Guidelines
- Write imperative, scoped commit messages (e.g., `fix: stabilize gift share links`). Avoid bundling unrelated features.
- PRs should describe the change, note affected routes/components, and include screenshots or screen recordings for UI updates.
- Link to tracking issues, mention required environment variables (e.g., `NEXT_PUBLIC_SITE_URL`), and highlight any manual QA performed.

## Configuration & Deployment Tips
- Production links must resolve to `https://pepero-factory.pages.dev`; set `NEXT_PUBLIC_SITE_URL` to override per environment.
- Cloudflare Pages builds run in edge runtime; avoid Node-only APIs in shared modules unless guarded.
