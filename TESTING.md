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
