# Frontend Package Update Report

**Date**: 2026-04-15
**Branch**: `major-package-updates` (branched from `dev` at `bb1becc`)

## Summary

All frontend dependencies were updated to their latest versions using `pnpm update --latest`.
npm was also updated from 10.9.2 → 11.12.1.
Several major version bumps triggered breaking changes that required config file migrations.

---

## Package Version Changes

### Runtime Dependencies (major bumps)

| Package      | Before | After  | Notes                                  |
|--------------|--------|--------|----------------------------------------|
| `highcharts` | 11.4.8 | 12.6.0 | Chart API changes possible             |
| `pinia`      | 2.3.1  | 3.0.4  | Store API breaking changes             |
| `vue-i18n`   | 9.14.5 | 11.3.2 | Composition API changes                |
| `vue-router` | 4.6.4  | 5.0.4  | Route guard and navigation API changes |
| `vue-gtag`   | 2.1.2  | 3.7.0  | Plugin setup API changed               |

### Dev Dependencies (major bumps)

| Package                    | Before | After  | Notes                                              |
|----------------------------|--------|--------|----------------------------------------------------|
| `@quasar/app-webpack`      | 3.15.1 | 4.4.5  | ESM config format required                         |
| `eslint`                   | 8.57.1 | 10.2.0 | Flat config required, legacy `.eslintrc.*` dropped |
| `eslint-config-prettier`   | 8.x    | 10.1.8 |                                                    |
| `eslint-plugin-vue`        | 9.x    | 10.8.0 |                                                    |
| `eslint-webpack-plugin`    | 4.x    | 6.0.0  |                                                    |
| `@semantic-release/github` | 11.x   | 12.0.6 |                                                    |
| `prettier`                 | 2.x    | 3.8.3  |                                                    |

### Minor/patch bumps (no breaking changes expected)

`axios`, `apexcharts`, `vue3-apexcharts`, `core-js`, `exceljs`, `jszip`, `qs`,
`quasar`, `@quasar/extras`, `vue`, `vue-pdf-embed`, `vue-gtag-next`,
all `@semantic-release/*`, `conventional-changelog-conventionalcommits`.

---

## Config File Migrations Required

### 1. `quasar.config.js` — CommonJS → ESM

`@quasar/app-webpack` v4 loads `quasar.config.js` as an ES module. The file used
`require()` and `module.exports`, which are not valid in ESM scope.

**Fix**: Converted to ESM syntax.

```js
// Before
const ESLintPlugin = require("eslint-webpack-plugin");
const { configure } = require("quasar/wrappers");
module.exports = configure(function (ctx) { ... });

// After
import ESLintPlugin from "eslint-webpack-plugin";
import { configure } from "quasar/wrappers";
export default configure(function (ctx) { ... });
```

### 2. `index.html` — New entry point file required

`@quasar/app-webpack` v4 requires `/index.html` at the project root instead of
`/src/index.template.html`. The mount point comment also changed.

**Fix**: Created `/index.html` from the old template, replacing the old div with
the new comment. The original `src/index.template.html` is left in place as a
historical reference but is no longer used by the build.

```html
<!-- Before (in src/index.template.html) -->
<!-- DO NOT touch the following DIV -->
<div id="q-app"></div>

<!-- After (in /index.html) -->
<!-- quasar:entry-point -->
```

### 3. ESLint — Flat config required

ESLint 10 dropped support for `.eslintrc.*` configuration files entirely. The old
`.eslintrc.js` and `.eslintignore` files no longer work.

**Fix**: Created `eslint.config.mjs` (flat config format). Used `.mjs` extension
so that ESLint loads it as ESM without requiring `"type": "module"` in
`package.json` (which would have broken other CJS config files like
`babel.config.js` and `.postcssrc.js`).

The old `.eslintrc.js` and `.eslintignore` are kept on disk for reference but are
no longer loaded by ESLint.

Key changes in `eslint.config.mjs`:
- Uses `eslint-plugin-vue`'s flat config preset (`flat/essential`)
- `ecmaVersion` updated from `2018` to `'latest'` (required for optional chaining
  `?.`, optional member access `?.[]`, and dynamic `import()` used in the codebase)
- Ignore patterns migrated from `.eslintignore` into the config `ignores` array

---

## Problems Encountered During Migration

### Problem 1: ESM vs CJS conflict with `"type": "module"`

Adding `"type": "module"` to `package.json` (suggested by a Node.js warning to
silence `MODULE_TYPELESS_PACKAGE_JSON`) caused `babel.config.js`, `.postcssrc.js`,
and webpack's internal module resolution for directories (e.g. `./routes`,
`./en-US`, `./sv`) to break, since those files use `module.exports` (CJS) and
webpack resolves bare directory imports differently under ESM mode.

**Resolution**: Did not add `"type": "module"`. Used `.mjs` extension for
`eslint.config.mjs` instead so ESLint treats it as ESM natively. The
`MODULE_TYPELESS_PACKAGE_JSON` warning from Node.js is benign and does not affect
the build.

### Problem 2: ESLint `ecmaVersion: 2018` rejecting modern syntax

After creating the flat config, ESLint reported parse errors on:
- `?.` (optional chaining) — `src/components/speechDataTableNgram.vue:232`
- `?.` (optional member access) — `src/pages/PdfPage.vue:178`
- `import()` (dynamic import) — `src/router/routes.js:4`

These are valid ES2020+ syntax that `ecmaVersion: 2018` does not support.

**Resolution**: Set `ecmaVersion: 'latest'` in the flat config.

### Problem 3: `@babel/eslint-parser` peer dep mismatch

`@babel/eslint-parser` declares peer compatibility with `eslint@^7-9` but eslint
10.2.0 was installed. The parser is **not used** in the new flat config (the Vue
flat preset supplies its own `vue-eslint-parser`), so this mismatch has no
practical effect. The warning appears in `pnpm install` output only.

---

## Known Issues / Things to Verify

### `vue-router` 5.x (was 4.x)
- Navigation guard signatures may have changed. Check all `router.beforeEach`,
  `router.afterEach`, and per-route `beforeEnter` guards.
- The `RouterView` and `RouterLink` component APIs are largely compatible but
  verify any advanced usage (scroll behavior, lazy loading, named views).
- `createRouter` / `createWebHashHistory` imports are unchanged.

### `pinia` 3.x (was 2.x)
- The `$patch`, `$reset`, `$subscribe`, and `$onAction` APIs may have changed.
- Devtools integration requires Pinia 3-compatible Vue devtools.
- Check any stores using `mapStores`, `mapState`, `mapActions` helpers.
- HMR store replacement behavior changed — test hot-reload in dev mode.

### `vue-i18n` 11.x (was 9.x)
- The Composition API (`useI18n`) is the primary API in v11; Options API helpers
  (`$t`, `$tc`, `$d`) still exist but may require explicit opt-in via
  `globalInjection: true` in the `createI18n` call.
- `$tc` (pluralization with count) was merged into `$t` in v10+.
  Any `$tc('key', count)` calls should be migrated to `$t('key', count)`.
- Legacy mode (`legacy: true`) may need to be set if Options API usage is widespread.

### `highcharts` 12.x (was 11.x)
- Accessibility module requirements changed. If `accessibility` is not explicitly
  included, a console warning is emitted.
- Some series type option names were normalized. Verify chart configs for
  deprecated option keys.
- `highcharts-vue` 2.x should be compatible with Highcharts 12 but test all chart
  components visually.

### `vue-gtag` 3.x (was 2.x)
- Plugin installation API changed. In v3, use `app.use(VueGtag, config, router)`
  instead of the v2 form. Check `src/boot/analytics.js`.
- The `useGtag()` composable replaces the Options API `$gtag` instance property.

### `@quasar/app-webpack` 4.x (was 3.x)
- ESM-only config format (already migrated).
- `boot/` files run in a stricter module context.
- SSR hydration and PWA workbox config options may have changed — not relevant for
  SPA-only builds but relevant if SSR/PWA is re-enabled.

### `eslint` 10.x (was 8.x)
- Flat config is now the only supported format (already migrated).
- The `--ext` flag in the `lint` npm script (`eslint --ext .js,.vue ./`) is no
  longer supported in ESLint 10. Update the script to use glob patterns:
  ```json
  "lint": "eslint src/**/*.{js,vue}"
  ```
- `eslint-config-prettier` v10 works only with the flat config format (already used).

### `prettier` 3.x (was 2.x)
- Formatting output may differ slightly from v2 — run `pnpm format` and review
  diffs before committing, to avoid noise in future PRs.

---

## Files Changed

| File                | Change                                                           |
|---------------------|------------------------------------------------------------------|
| `package.json`      | All dependency versions updated                                  |
| `pnpm-lock.yaml`    | Lockfile regenerated                                             |
| `quasar.config.js`  | Converted from CJS (`require`) to ESM (`import`)                 |
| `index.html`        | Created (new v4 entry point, replaces `src/index.template.html`) |
| `eslint.config.mjs` | Created (ESLint 10 flat config, replaces `.eslintrc.js`)         |
| `.eslintignore`     | Deleted (ignores now in `eslint.config.mjs`)                     |

---

## Build Status

`pnpm run build` — **success** (exit 0, SPA output in `dist/spa/`)
