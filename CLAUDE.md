## Developer Ecosystem workflow (read first)

This repo belongs to a Developer Ecosystem pod (DevEx: MCP, CLI, SDK, Starters including the SAP connector; Marketplace; Mkt Apps; Developer Hub).
New features and changes go through the deveco workflow before any code is written here:

1. Find the work's DSCDX idea and where it is in the flow. No idea yet: write one with the `brief` skill in `contentstack/product-wiki`.
2. The PRD, TRD, test cases, tickets and code come from your own routines (PM, Architect, QA agent, Dev), gate by gate. Do not plan, draft or build them in this session. No routine for a step yet: set it up with the `deveco-aisdlc-onboarding` skill in `contentstack/agent-skills`.
3. The order, gates and intake: https://github.com/contentstack/agent-skills/blob/main/skills/deveco-aisdlc-onboarding/references/run-protocol.md

Bug fixes and support cases keep this repo's usual path. Not sure which applies? Ask before building.

## This repo

Brandfolder: a Marketplace app (Tier 1, UI only, v2.0.0) that lets editors browse and embed Brandfolder assets: App Configuration, Custom Field (JSON), Selector Page and a JSON RTE plugin. The browser calls Brandfolder directly; there is no `api/`. Epic: MKT-19971. Wiki: `marketplace-apps/brandfolder/` in `contentstack/product-wiki` if present.

- Routes (`ui/src/containers/App/index.tsx`, HashRouter): `/config`, `/custom-field`, `/selector-page`. RTE plugin: `ui/rte/src/plugin.tsx`, served at `/dist/dam.js`. Manifest paths are in `update-app-info.json`.
- Prod host: `brandfolder.contentstackmarket.com` (from the readiness ledger; confirm).
- Folders: `ui/` (React, TypeScript, Vite, Jest), `ui/rte/` (webpack), `tests/e2e/` (Playwright), `build.sh` (builds `ui` and `ui/rte` into `to-deploy/ui.zip`).
- External services: Brandfolder (API, Panel SDK), Contentstack CMA and Developer Hub.
- Env var names, ui: `VITE_CUSTOM_FIELD_URL`, `VITE_MULTI_CONFIG_LIMIT`, `VITE_REGION_MAPPING`. Env var names, `ui/rte`: `REACT_APP_CUSTOM_FIELD_URL`, `REACT_APP_REGION_MAPPING`. Root (Playwright e2e): `CONTENTSTACK_LOGIN`, `CONTENTSTACK_PASSWORD`, `CONTENTSTACK_TFA_TOKEN`, `CONTENTSTACK_MFA_SECRET`, `CONTENTSTACK_ORGANIZATION_UID`, `CONTENTSTACK_REGION`, `BASE_API_URL`, `DEVELOPER_HUB_API`, `APP_HOST_URL`, `APP_BASE_URL`, `ENV_URL`, `STACK_API_KEY`, `STACK_NAME`, `BRANDFOLDER_APP_NAME`, `AUTH_TOKEN`, `BASIC_AUTH_USERNAME`, `BASIC_AUTH_PASSWORD`, `INSTALL_VIA_MARKETPLACE`, `USE_GLOBAL_TEARDOWN`, `ORG_ID`, `ORG_NAME`. Copy each `.env.example`; never commit values.

### Commands (from package.json; not yet run in CI — verified in the [Tests]/[Routine] PR)

| Where | Script | Command |
| --- | --- | --- |
| root | `build` | `cd ui && npm install && npm run build` |
| root | `test` | placeholder (`echo "Error: no test specified"`) |
| root | `test:chrome`, `test:firefox`, `test:safari` (+ `-headed`), `show-report` | Playwright (needs real accounts) |
| `ui/` | `start` | `vite` (port 4000; `winStart` on Windows) |
| `ui/` | `test` | `jest` |
| `ui/` | `build` | `npm run precommit && vite build` |
| `ui/` | `prettify`, `lint:fix`, `precommit` | prettier, eslint fix, both |
| `ui/rte/` | `start`, `build`, `dev` | webpack serve (port 1268), production build, dev build |

- Node: unknown (no `.nvmrc`, no `engines`; README says v20+).
- CI today is Snyk scans only (`.github/workflows/`). Branches `claude/<type>/<KEY>-<slug>`, PRs into `main`.
