# AI Coding Agent Guide - Swedeb Frontend

## Project Summary

**Swedeb Frontend** is a Vue 3 + Quasar SPA that exposes Swedish parliamentary debate data (1867–present) from the SWERIK project. It communicates with the Swedeb API via a same-origin `/v1` endpoint, backed by Pinia stores, Axios, and vue-i18n.

## Repository Structure

- `src/pages/`: route-level screens (thin, composition-focused)
- `src/layouts/`: top-level shells (`MainLayout.vue`, `ToolsLayout.vue`)
- `src/components/`: reusable UI pieces
- `src/stores/`: Pinia stores — API requests, download helpers, query-string building, shared state
- `src/router/`: route table (`routes.js`) and document-title guards
- `src/boot/`: app bootstrapping — Axios (`boot/axios`), i18n, and analytics
- `src/i18n/sv/index.js` and `src/i18n/en-US/index.js`: translation dictionaries
- `src/css/`: shared theme (`app.sass`) and Quasar variable files
- `src/assets/` and `public/`: static assets
- `.github/workflows/` and `.github/scripts/`: build and release automation

## Architecture Rules

### UI, State, and Data Boundaries
- Pages handle composition and page flow only.
- Reusable presentation belongs in `src/components/`.
- Cross-page state, API fetches, export logic, and query-string building live in Pinia stores.
- Do not scatter new API calls across components when a store already owns that tool's data.
- Reuse existing stores before creating a new global store.

### Key Stores
- `metaDataStore` — shared source for metadata filters and query parameter construction
- `wordTrendsDataStore` — word trends tool
- `kwicDataStore` — KWIC tool
- `speechesDataStore` — speeches tool
- `nGramDataStore` — n-grams tool
- `pdfDataStore` — PDF tool

### Routing and Navigation
- Add or change routes in `src/router/routes.js`.
- Set `meta.title` for user-facing pages; router guards use it to set `document.title`.
- Preserve the `/tools/...` route structure and the split between `MainLayout.vue` and `ToolsLayout.vue`.
- Do not change `process.env.API`, `publicPath`, or router mode without understanding deployment impact.

### API and Backend Contract
- All API requests go through `src/boot/axios.js` and use `process.env.API`.
- Preserve the same-origin `/v1` assumption from `quasar.config.js` unless the task explicitly changes deployment behavior.
- When changing request params or response shapes, update the owning store and verify the backend contract first.
- Prefer extending existing query construction in stores over building ad hoc request strings in components.
- If backend response fields change, update dependent column maps, downloads, charts, and tables in the owning store.

### i18n and Copy
- All user-visible copy belongs in `src/i18n/`.
- Update **both** `src/i18n/sv/index.js` and `src/i18n/en-US/index.js` when adding new keys.
- Prefer `$t(...)` and existing translation keys over hard-coded strings in templates.

### Styling and Assets
- Use `src/css/app.sass` and Quasar variable files for broad theme changes.
- Keep static assets in `public/` or `src/assets/` consistent with current usage.
- Avoid inline styles unless the surrounding file already uses them and the change is very local.

### Generated Files
- Edit source files in `src/`, `public/`, `quasar.config.js`, and workflow/config files.
- Do not hand-edit `.quasar/` or build artifacts under `dist/`.

## Development Commands

```bash
pnpm dev       # start dev server
pnpm lint      # ESLint + Prettier check
pnpm format    # auto-format
pnpm build     # production build
```

Use `pnpm`; the lockfile is `pnpm-lock.yaml`. Do not use `npm` or `yarn`.

## Code Conventions

- JavaScript and Vue SFC only — do not introduce TypeScript unless the task explicitly includes it.
- 2-space indentation, ESLint + Prettier rules enforced.
- Prefer Quasar components already used in the repo.
- Keep imports explicit and consistent with current aliases (`src/...`, `boot/...`).
- Stores use Pinia option stores with `state` and `actions`; extend that pattern unless the task requires a broader refactor.
- Keep export and download logic in the store that already owns the data.
- Match surrounding component style; the repo mixes `script setup` components with store/action-based state.
- Avoid large refactors while doing small UI or data fixes.

## Safe Change Defaults

- **Tool-specific behavior**: start in the owning Pinia store, then update the page or component that renders it.
- **Filter behavior**: inspect `src/components/metaDataFilter.vue`, `src/components/toolsFilters.vue`, and `src/stores/metaDataStore.js` together.
- **Tool pages**: start with the matching store before touching the page or table component.
- **Shared layout or navigation**: inspect both layout files and `routes.js` before editing.
- **Text or labels**: check whether the string is translated before editing the template.
- **API-affecting work**: inspect the corresponding backend endpoint before changing params, URLs, or response assumptions.
- **Release or deployment**: inspect `CI-CD.md`, `.releaserc.yml`, workflow YAML, and `.github/scripts/build-assets.sh` together.
- Leave unrelated release history, generated files, and uncommitted user changes untouched.

## Validation Before Finishing

- Run `pnpm lint` after JS or Vue edits.
- Run `pnpm build` after route, boot, config, dependency, or packaging changes.
- Manually sanity-check affected pages, filters, and downloads — no automated test suite exists today.
- Confirm new i18n keys exist in both language files.
- Call out any backend dependency, missing validation, or residual risk in the handoff.

## Git Workflow & Releases

- Feature PRs target `dev`; promote sequentially `dev` → `test` → `staging` → `main`.
- Only `test`, `staging`, and `main` trigger CI/CD builds.
- Commits use Conventional Commit format: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- Stage only files relevant to the task; never use `git add .`.
- Include `Closes #<issue>` or `Fixes #<issue>` when the commit should close the related issue.

## Task-Specific Instructions

Detailed guidance lives in `.github/instructions/`:

- `frontend.instructions.md`: Vue, Quasar, Pinia, i18n, and frontend editing patterns
- `github-workflow.instructions.md`: issue creation, staging discipline, and commit message rules
