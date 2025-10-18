# Testing Log

## 2025-10-18
- Attempted to install backend dependencies via `npm install` inside `server/` but encountered an HTTP 403 error from the npm registry, preventing dependency installation and subsequent lint/test execution.
- Re-attempted dependency installation for both `server/` and `client/` directories; the npm registry continued to respond with HTTP 403 errors (e.g., blocking access to `axios` and `@headlessui/react`).
- After adding flat ESLint configuration files, running `npm run lint` in `client/` now fails early because npm cannot download `@eslint/js` (the registry 403 prevents installing the new lint dependencies). Running the same command in `server/` yields an identical module resolution error for `@eslint/js`.
- Testing remains blocked until registry access is restored. Once dependencies are installed, rerun `npm run lint` inside both `client/` and `server/` directories to execute the configured static analysis.

## 2025-10-19
- Successfully installed backend dependencies in `server/` after pinning `json2csv` to `^5.0.7`; noted npm deprecation warnings and two moderate vulnerabilities pending review.
- Installed frontend dependencies in `client/`; npm reported five vulnerabilities (three moderate, two high) that require follow-up before production deployment.
- `npm run lint` now passes in both `server/` and `client/` directories following tweaks to unused-variable handling in middleware and React catch blocks.

## 2025-10-20
- Re-installed backend dependencies after overriding `express-validator` to consume `validator@13.15.0`; `npm audit` still flags the upstream `validator` advisory without a published fix, but no runtime regressions were observed.
- Removed unused client-side export libraries (`jspdf`, `papaparse`, `xlsx`) and reinstalled dependencies to eliminate the SheetJS prototype-pollution vulnerability; `npm audit` now reports only the outstanding `esbuild` advisory that requires a Vite major upgrade.
- Re-ran `npm run lint` and `npm run build` in `client/` as well as `npm run lint` in `server/` to confirm the dependency changes left the codebase in a passing state.

## 2025-10-21
- Upgraded the frontend toolchain to `vite@7.1.10` and `@vitejs/plugin-react@5.0.4`, reinstalled dependencies, and confirmed `npm audit` now reports zero vulnerabilities for the client package set.
- Reinstalled backend dependencies with `validator@13.15.15`; `npm audit` continues to highlight the upstream URL validation bypass advisory without an official patch, but the project avoids the affected `isURL` helper.
- Executed `npm run lint` in both `client/` and `server/` along with `npm run build` in `client/` to validate the application after dependency updates.

## 2025-10-22
- Reinstalled dependencies for both frontend and backend without errors; npm reported zero vulnerabilities on the client and two known moderate advisories on the server pending upstream fixes.
- Executed `npm run lint` in `client/` and `server/` and observed clean passes.
- Ran `npm run build` in `client/`; the production bundle generated successfully with Vite 7 and no warnings.

## 2025-10-23
- Confirmed Node.js version alignment via the new `.nvmrc` pin (`nvm use` resolves to 18.18.0`).
- Re-ran `npm run lint` in both `client/` and `server/`; both completed with zero warnings.
- Executed `npm run build` from `client/` to verify the removal of `packageManager` metadata introduced no build regressions.

## 2025-10-24
- Reinstalled frontend dependencies (`npm install` inside `client/`) and validated both `npm run lint` and `npm run build` complete without warnings using Vite 7.
- Reinstalled backend dependencies (`npm install` inside `server/`) and confirmed `npm run lint` succeeds; `npm audit` still reports the upstream `validator` advisory (GHSA-9965-vmph-33xx) with no patched release available.
- Documented the outstanding dependency advisory in `README.md` so deployers can track the upstream fix before production rollouts.

## 2025-10-25
- Replaced the backend's `express-validator` usage with Zod-based request validation and reinstalled dependencies; `npm audit` now reports zero vulnerabilities.
- Ran `npm install` followed by `npm run lint` in `server/` to confirm the new validation middleware integrates cleanly.
- Executed `npm run lint` and `npm run build` in `client/` to ensure frontend checks continue to pass after the backend dependency changes.

## 2025-10-26
- Added `scripts/qa-check.sh` to orchestrate dependency installs (optional), linting, and the production build from a single command.
- Executed `./scripts/qa-check.sh --skip-install`; server lint, client lint, and client build all completed successfully.
