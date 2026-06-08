# bridges-core-sdk — Copilot Review Instructions

## Errors

- There is ONE custom error class in this package: `BridgeError` (in `src/client/httpClient.ts`). Do not introduce new error classes or hierarchies inside bridges-core-sdk itself. Downstream bridge SDKs (e.g. flyover-sdk) are expected to subclass `BridgeError` — that is intentional and correct.
- Use `BridgeError` for operational/runtime failures (network, contract calls, HTTP ≥ 400, missing packages).
- Use plain `Error` for validation and programmer errors (missing required fields, invalid config).
- Always populate `timestamp: Date.now()`, `recoverable`, `message`, and `details` when constructing a `BridgeError`.
- `BridgeError` wrapping a caught exception should put `e.message` inside `details` (e.g. `details: { error: e.message }`). Exception: when the full error object is needed for richer context, the whole `e` may be used instead.
- Do not use error codes or enums inside this package — messages are free-form strings. Downstream SDKs may add their own error catalogs.

## Modules and exports

- No `export default` in any `.ts` file. All exports must be named.
- Every domain folder must have a barrel `index.ts` that uses `export *` re-exports.
- The build output directory is `lib/`, not `dist/`. CI cleanup steps must use `rm -rf lib`.
- The `initialization` subpath (`src/initialization.ts`) is a separate build target — do not re-export it from `src/index.ts`.

## HTTP and serialization

- Always use `json-bigint` (the `serializer` instance in `crossFetch.ts`) to serialize POST bodies and parse responses. Never use `JSON.parse` or `JSON.stringify` directly on bridge API data — contract values can exceed JavaScript's safe integer range.
- HTTP ≥ 400 responses must be mapped to `BridgeError` using the server's `message`, `timestamp`, `recoverable`, and `details` fields.

## Validation

- No Zod, Joi, Yup, or any schema validation library. All validation is hand-rolled.
- Most boolean predicates (`isBtcAddress`, `isRskAddress`, `isBtcMainnetAddress`, etc.) must never throw — return `true`/`false` only. Exception: `isSecureUrl` throws on a structurally invalid URL string (by design — it delegates to `new URL()`). New predicates should follow the no-throw contract unless there is a strong reason to deviate.
- Use `assertTruthy<T>` (in `src/utils/validation.ts`) to narrow `T | undefined | null` to `T`.
- Use `validateRequiredFields` for checking required object properties; it throws plain `Error`.

## Configuration

- All per-bridge config interfaces must extend `BridgesConfig` from `src/config/index.ts`.
- Common fields (`network`, `allowInsecureConnections`, `rskConnection`) must not be duplicated in per-bridge configs — they are merged by `getConfig()` in `initialization.ts`.
- Captcha resolution must be injected as `captchaTokenResolver: () => Promise<string>`, never hardcoded.

## Constants

- Exported constant objects must be wrapped with `deepFreeze(... as const)`.
- Module-private constants use `SCREAMING_SNAKE_CASE`. Exported constants also use `SCREAMING_SNAKE_CASE`.

## Async

- Do not write `return await promise` outside of a `try` block — ESLint enforces `no-return-await`.
- Use dynamic `import()` for lazily loading bridge SDK packages in `initialization.ts`.
