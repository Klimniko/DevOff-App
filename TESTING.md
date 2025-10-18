# Testing Log

## 2025-10-18
- Attempted to install backend dependencies via `npm install` inside `server/` but encountered an HTTP 403 error from the npm registry, preventing dependency installation and subsequent lint/test execution.
- Re-attempted dependency installation for both `server/` and `client/` directories; the npm registry continued to respond with HTTP 403 errors (e.g., blocking access to `axios` and `@headlessui/react`).
- After adding flat ESLint configuration files, running `npm run lint` in `client/` now fails early because npm cannot download `@eslint/js` (the registry 403 prevents installing the new lint dependencies). Running the same command in `server/` yields an identical module resolution error for `@eslint/js`.
- Testing remains blocked until registry access is restored. Once dependencies are installed, rerun `npm run lint` inside both `client/` and `server/` directories to execute the configured static analysis.
