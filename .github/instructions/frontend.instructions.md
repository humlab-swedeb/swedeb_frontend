---
description: "Use when changing Vue components, Pinia stores, routing, i18n, Quasar config, or frontend API wiring."
name: "Frontend"
---
# Frontend

- Prefer editing the owning Pinia store first for search, filters, downloads, or result tables.
- Use `metaDataStore` as the shared source for metadata filters and query parameter construction.
- Keep page components thin: submit orchestration, tab state, visibility state, and composition.
- Keep reusable presentation in components; avoid hiding new API fetch logic inside presentational components.
- Reuse `boot/axios` and `boot/i18n`; do not create alternate global clients.
- Add routes in `src/router/routes.js`; keep page titles in `meta.title`.
- Update both language files under `src/i18n/` when adding user-facing strings.
- Prefer Quasar controls already used in nearby files for consistency.
- Match the surrounding component style instead of rewriting files to a different pattern.
- Stores use Pinia option stores with `state` and `actions`; extend that pattern unless the task requires a broader refactor.
- Keep export and download logic in the store that already owns the data.
- When touching filter behavior, inspect `src/components/metaDataFilter.vue`, `src/components/toolsFilters.vue`, and `src/stores/metaDataStore.js` together.
- When touching tool pages, start with the matching store: `wordTrendsDataStore`, `kwicDataStore`, `speechesDataStore`, `nGramDataStore`, or `pdfDataStore`.
- Preserve the `/tools/...` route structure and the split between `MainLayout.vue` and `ToolsLayout.vue`.
- Do not change `process.env.API`, `publicPath`, or router mode casually; those affect deployment and asset loading.
- If backend response fields change, update dependent column maps, downloads, charts, and tables in the owning store.
- Validate with `pnpm lint` and `pnpm build`, then manually check the affected route when possible.
