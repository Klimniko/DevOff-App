# Testing Log

## 2025-10-18
- Attempted to install backend dependencies via `npm install` inside `server/` but encountered an HTTP 403 error from the npm registry, preventing dependency installation and subsequent lint/test execution.
- Testing is blocked until registry access is restored. Once dependencies are installed, run `npm run lint` in both `client/` and `server/` directories to execute available automated checks.
