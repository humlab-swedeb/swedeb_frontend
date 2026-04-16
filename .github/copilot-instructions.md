# Swedeb Frontend - AI Coding Instructions

This file should stay small and always-on. Put detailed frontend guidance in `.github/instructions/*.instructions.md` so it loads only when relevant.

## Documentation scope

- Trust `README.md` for local setup, stack, and developer commands.
- Trust `CI-CD.md`, `.releaserc.yml`, `.github/workflows/ci-ghcr.yml`, and `.github/scripts/build-assets.sh` for release and asset packaging behavior.
- Trust `package.json` and `quasar.config.js` for scripts, runtime env, routing mode, and build config.
- Treat `CHANGELOG.md` as release history, not implementation guidance.
- Do not use generated output in `.quasar/` or `dist/` as the source of truth.

## Repository structure

Swedeb Frontend is a Vue 3 + Quasar SPA backed by Pinia stores and a same-origin API.

- `src/pages/`: route-level screens
- `src/layouts/`: top-level shells
- `src/components/`: reusable UI pieces
- `src/stores/`: Pinia stores, API requests, download helpers, shared state
- `src/router/`: route table and document-title handling
- `src/boot/`: app bootstrapping for Axios, i18n, and analytics
- `src/i18n/`: translation dictionaries
- `src/css/`: shared theme and app styling
- `src/assets/` and `public/`: static assets
- `.github/workflows/` and `.github/scripts/`: build and release automation

## Always-on architecture rules

### UI, state, and data boundaries

- Keep pages focused on composition and page flow.
- Keep reusable presentation in `src/components/`.
- Keep cross-page state, API fetches, export logic, and query-string building in Pinia stores.
- Do not scatter new API calls across multiple components when a store already owns that tool's data.
- Reuse existing stores before creating another global store.
- Match the surrounding component style; this repo already mixes `script setup` components with store/action-based state.

### Routing and navigation

- Add or change routes in `src/router/routes.js`.
- Set `meta.title` for user-facing pages; router guards use it to set `document.title`.
- Keep route and layout relationships consistent with `MainLayout.vue` and `ToolsLayout.vue`.

### API and backend contract

- Frontend API requests go through `src/boot/axios.js` and use `process.env.API`.
- Preserve the existing same-origin `/v1` assumption from `quasar.config.js` unless the task explicitly changes deployment behavior.
- When changing request params or response shapes, update the owning store and verify the backend contract before shipping.
- Prefer extending existing query construction in stores over hand-building ad hoc request strings in components.

### i18n and copy

- User-visible copy belongs in `src/i18n/`.
- Update both `src/i18n/sv/index.js` and `src/i18n/en-US/index.js` when adding new keys, or document why a language is intentionally missing.
- Prefer `$t(...)` and existing translation keys over hard-coded strings in templates.

### Styling and assets

- Use shared styles in `src/css/app.sass` and Quasar variable files for broad theme changes.
- Keep static assets in `public/` or `src/assets/` consistent with current usage.
- Avoid inline styles unless the surrounding file already uses them and the change is very local.

### Build and generated files

- Edit source files in `src/`, `public/`, `quasar.config.js`, and workflow/config files.
- Do not hand-edit `.quasar/` or build artifacts under `dist/`.
- Keep release automation changes aligned across workflow YAML, `.releaserc.yml`, and build scripts.

## Workflow expectations

- Use `pnpm`; the lockfile is `pnpm-lock.yaml`.
- Common commands:
  - `pnpm dev`
  - `pnpm lint`
  - `pnpm format`
  - `pnpm build`
- Run targeted validation before finishing.
- Run `pnpm lint` for JS and Vue edits.
- Run `pnpm build` for routing, Quasar config, boot, i18n, dependency, or release-affecting changes.
- The `test` script is a placeholder today; do not claim automated test coverage that does not exist.

## Code conventions

- Keep JavaScript and Vue SFC changes consistent with existing files; do not introduce TypeScript unless the task explicitly includes it.
- Use 2-space indentation and existing ESLint and Prettier rules.
- Prefer Quasar components and patterns already used in the repo.
- Keep imports explicit and consistent with current aliases such as `src/...` and `boot/...`.
- Preserve existing naming unless the change includes a deliberate cleanup.
- Avoid large refactors while doing small UI or data fixes.
- Prefer small store actions or helpers over duplicating transformation logic in several components.

## Safe change defaults

- For tool-specific behavior, start in the owning Pinia store and then update the page or component that renders it.
- For shared layout or navigation changes, inspect both layouts and router files before editing.
- For text or labels, check whether the string is translated before editing the template.
- For API-affecting work, inspect the corresponding backend endpoint before changing params, URLs, or response assumptions.
- For release or deployment changes, inspect `CI-CD.md`, `.releaserc.yml`, workflow YAML, and `.github/scripts/build-assets.sh` together.
- Keep unrelated release history, generated files, and user changes untouched.

## Validation before finishing

- Run `pnpm lint` after JS or Vue changes when practical.
- Run `pnpm build` after route, boot, config, dependency, or packaging changes when practical.
- Manually sanity-check affected pages, filters, and downloads if no automated test covers them.
- Confirm new i18n keys exist where needed.
- Mention any backend dependency, missing validation, or residual risk in the handoff.

## Task-specific instructions

Use the targeted files under `.github/instructions/` instead of growing this file:

- `frontend.instructions.md`: Vue, Quasar, Pinia, i18n, and frontend editing patterns
- `github-workflow.instructions.md`: issue creation, staging discipline, and commit message rules
