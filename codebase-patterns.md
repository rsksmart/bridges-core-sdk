# bridges-core-sdk — Codebase Patterns Reference

This document captures the architectural decisions, coding conventions, and design patterns
used in `@rsksmart/bridges-core-sdk`. Intended as a reference for LLM rules and onboarding.

---

## 1. Project Structure

The repository is organized by **domain** under `src/`. Each domain folder owns its
source, types, and tests. There are no feature slices or layer slices.

```
src/
├── index.ts              ← main public barrel
├── initialization.ts     ← separate subpath entry (@rsksmart/bridges-core-sdk/initialization)
├── sdk/core.ts           ← Bridge interface, BridgeMetadata, Fee types
├── blockchain/           ← BlockchainConnection, BlockchainReadOnlyConnection, tx helpers
├── client/               ← HttpClient interface, BridgeError, cross-fetch implementation
├── config/               ← Network type, BridgesConfig, per-bridge config interfaces
├── common/               ← shared immutable constants (tokens)
└── utils/                ← pure helpers: validation, parsing, mutability
```

**Build output** goes to `lib/` (not `dist/`). Only `lib/` artifacts are published.

**`integration-test/`** is a **separate private npm package** — it has its own `package.json`,
`jest.config.js`, and ESLint config. It imports the SDK by package name, not relative path.
Integration tests are **not run in CI**; they require a live network.

---

## 2. TypeScript Style

### Strict compiler flags (non-negotiable)

Both `core.tsconfig.json` and `initialization.tsconfig.json` enable full strict mode plus:

```json
"noUnusedLocals": true,
"noUnusedParameters": true,
"noImplicitReturns": true,
"noFallthroughCasesInSwitch": true,
"noUncheckedIndexedAccess": true,
"noImplicitOverride": true
```

Target: `es2016`. Module: `ES2022`. `moduleResolution: Node16`.

### Interfaces for contracts, types for unions and mapped types

- **Interfaces**: object shapes, class `implements` targets, config hierarchies
- **Types**: union literals, mapped types, function signatures

```typescript
// type for union literal
export type Network = 'Mainnet' | 'Testnet' | 'Regtest' | 'Alphanet' | 'Development'

// type for function signature
export type CaptchaTokenResolver = () => Promise<string>

// type for mapped shape
export type BridgesInitializations = {
  [key in keyof AllBridgesConfigs]: Omit<AllBridgesConfigs[key], keyof BridgesConfig>
}

// interface for contract
export interface HttpClient {
  get: <T>(url: string, options?: Partial<HttpClientOptions>) => Promise<T>
  post: <T>(url: string, body: object, options?: Partial<HttpClientOptions>) => Promise<T>
  getCaptchaToken: CaptchaTokenResolver
}
```

### Type-only imports

Always use `import { type Foo }` for type-only imports:

```typescript
import { type BridgesConfig } from '.'
import { type CaptchaTokenResolver } from '../client'
```

### No decorators

Zero `@` decorator usage anywhere in `src/`.

### `any` usage

`any` appears only in:
- `catch` blocks (`catch (e: any)`)
- Test mocks (e.g. `contractMock: any`)
- `BridgeError.details` field (intentionally loose)

Do not introduce `any` elsewhere.

---

## 3. Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Source files | camelCase | `crossFetch.ts`, `httpClient.ts` |
| Folders | lowercase | `client/`, `utils/`, `config/` |
| Test files | `*.test.ts` co-located | `blockchain.test.ts` |
| Classes | PascalCase | `BlockchainConnection`, `BridgeError` |
| Interfaces | PascalCase | `HttpClient`, `Connection`, `Bridge` |
| Functions | camelCase verbs | `getHttpClient`, `validateRequiredFields` |
| Private fields | `_camelCase` with underscore prefix | `_signer`, `_provider` |
| Module-private constants | `SCREAMING_SNAKE_CASE` | `RSK_ADDRESS_REGEX`, `DEFAULT_NODE_URL` |
| Exported constants | `SCREAMING_SNAKE_CASE` | `BTC_ZERO_ADDRESS_MAINNET` |
| Exported constant objects | camelCase | `tokens` |
| Network/union members | PascalCase strings | `'Mainnet'`, `'Testnet'` |

---

## 4. Error Handling

### Single error class: `BridgeError`

There is **one** custom error class. No deep hierarchy, no error codes enum.

```typescript
export class BridgeError extends Error {
  timestamp: number
  recoverable: boolean
  details: any
  serverUrl?: string
  product?: string
  constructor (args: ErrorDetails) {
    super(args.message)
    // ...
  }
}
```

### When to use `BridgeError` vs plain `Error`

| Situation | Use |
|---|---|
| Operational/runtime failures (network, contract, HTTP ≥ 400) | `BridgeError` |
| Developer/programming errors (validation, missing config fields) | plain `Error` |
| Initialization with missing package | `BridgeError` with `recoverable: false` |

### Four creation patterns

**1. Private factory function** (wraps caught errors):
```typescript
function connectionError (e: Error): BridgeError {
  return new BridgeError({
    timestamp: Date.now(),
    recoverable: true,
    message: 'error getting authenticated signer',
    details: { error: e.message }
  })
}
```

**2. Direct `throw new BridgeError({...})`** in domain logic:
```typescript
throw new BridgeError({
  timestamp: Date.now(),
  recoverable: true,
  message,
  details: { txHash: txResult.txHash }
})
```

**3. HTTP error mapped from server JSON** (server fields passed through):
```typescript
throw new BridgeError({
  serverUrl: response.url,
  message: responseBody.message,
  timestamp: responseBody.timestamp,
  recoverable: responseBody.recoverable,
  details: responseBody.details
})
```

**4. Conversion with selective re-throw** (initialization, non-MODULE_NOT_FOUND errors bubble up):
```typescript
function convertToBridgeError (bridgeName: BridgeName, e: any): BridgeError {
  if (e?.code !== 'ERR_MODULE_NOT_FOUND') {
    throw e  // re-throw unknown errors
  }
  return new BridgeError({ ... })
}
```

### Validation errors use plain `Error`

```typescript
if (missingProperties.length !== 0) {
  throw new Error('Validation failed for object with following missing properties: ' + missingProperties.join(', '))
}
```

### `isValidSignature` swallows errors silently

Returns `false` on failure — does not throw:
```typescript
try {
  const recovered = ethers.utils.recoverAddress(hash, signature)
  return recovered.toLowerCase() === address.toLowerCase()
} catch {
  return false
}
```

---

## 5. Testing Style

### Framework

Jest + `ts-jest` preset, `@jest/globals` for explicit imports, `clearMocks: true`.

```typescript
import { describe, test, expect, jest, beforeAll, beforeEach } from '@jest/globals'
```

### File placement

Tests are **co-located** with source files. No `__tests__/` directories.

```
src/blockchain/blockchain.ts
src/blockchain/blockchain.test.ts   ← same folder
```

### Describe/test naming: `describe('X should', () => { test('behavior') })`

The word **"should"** goes in the `describe` block, not the `test` name:

```typescript
describe('BlockchainConnection factories should', () => {
  test('create connection using standard', async () => { ... })
  test('throw error when connection fails', async () => { ... })
})

describe('validateRequiredFields function should', () => {
  test('throw if required field is missing', () => { ... })
  test('not throw if all required fields are present', () => { ... })
})
```

**Do not** write `it('should create connection ...')` — put "should" in the describe.

### Assertion patterns

| Pattern | Use |
|---|---|
| `expect(x).toBe(y)` | Primitives, booleans |
| `expect(x).toEqual(y)` | Objects, arrays |
| `expect(x).toBeInstanceOf(BridgeError)` | Error type checks |
| `expect(() => fn()).toThrow(BridgeError)` | Sync throws |
| `await expect(promise).rejects.toThrow(BridgeError)` | Async throws (preferred) |
| `expect.assertions(n)` | Guard for async `.catch()` tests |
| `expect(mock).toHaveBeenCalledTimes(n)` | Mock call count |

Prefer `.rejects.toThrow()` for async error assertions. Avoid `try/catch` in tests — only use `.catch(e => ...)` when you need to assert on both the error class and its properties simultaneously, and guard with `expect.assertions(n)`.

### Mock patterns

**Module mocks** at top of file:
```typescript
jest.mock('ethers')
jest.mock('cross-fetch')
```

**Spy pattern** for partial mocking:
```typescript
const decodeBech32mSpy = jest.spyOn(bech32m, 'decode')
```

**Manual mock objects** for complex types (ethers signer, provider, contract):
```typescript
let contractMock: any
beforeEach(() => {
  contractMock = {
    callStatic: {
      contractMethodOk: jest.fn(),
      contractMethodFail: jest.fn().mockImplementation(async () => {
        throw new Error('some error')
      })
    }
  }
})
```

### Lifecycle hooks

| Hook | Purpose |
|---|---|
| `beforeAll` | Create shared instances (e.g. `BlockchainConnection`), set up contract mocks |
| `beforeEach` | Reset per-test state (e.g. contract mock return values) |
| `afterEach` | `jest.clearAllMocks()` when needed |
| `afterAll` | Not used |

### Parameterized tests

`it.each(...)` is used for validating many input variants (e.g. BTC address formats):

```typescript
it.each([
  ['valid mainnet P2PKH', 'valid address', true],
  ['invalid', 'bad address', false],
])('%s', (_, address, expected) => {
  expect(isBtcAddress(address)).toBe(expected)
})
```

### No tests in CI for integration tests

Integration tests (`test:integration`) run manually against a live network and are
**excluded from CI**. They use `FailFastEnvironment` to skip remaining tests after
the first failure and a 2-hour timeout (`EXTENDED_TIMEOUT = 7200 * 1000`).

---

## 6. Module & Export Patterns

### Barrel exports only

Every domain folder has an `index.ts` re-exporting everything:

```typescript
// src/client/index.ts
export * from './crossFetch'
export * from './httpClient'
```

The root `src/index.ts` re-exports all domain barrels plus `ethers`:

```typescript
export * from './sdk/core'
export * from './blockchain/blockchain'
export * from './config'
export * from './common'
export * from './utils'
export * from './client'
export { ethers } from 'ethers'
```

### Named exports only

**No `export default`** in any `.ts` source file. All exports are named.

### Subpath export for initialization

`src/initialization.ts` is built as a separate entry point and exposed via:

```json
"exports": {
  ".": "./lib/index.js",
  "./initialization": "./lib/initialization.js"
}
```

Consumers import it as `@rsksmart/bridges-core-sdk/initialization`.

---

## 7. Class Design

### Composition over inheritance

Classes implement interfaces but do not extend each other. Only `BridgeError extends Error`.

```typescript
export class BlockchainConnection implements Connection { ... }
export class BlockchainReadOnlyConnection implements Connection { ... }
// These two classes are independent — no inheritance between them
```

No abstract classes anywhere.

### Private constructor + static async factories

`BlockchainConnection` enforces creation through static factory methods:

```typescript
export class BlockchainConnection implements Connection {
  private constructor (
    private readonly _signer: Signer
  ) {}

  static async createUsingStandard (standard: providers.ExternalProvider): Promise<BlockchainConnection> { ... }
  static async createUsingEncryptedJson (json: string, password: string): Promise<BlockchainConnection> { ... }
  static async createUsingPassphrase (privateKey: string): Promise<BlockchainConnection> { ... }
  static async createUsingRpc (rpcUrl: string): Promise<BlockchainConnection> { ... }
}
```

### Private backing fields with public getters

```typescript
private readonly _signer: Signer

get signer (): Signer {
  return this._signer
}
```

### Object literal as interface implementation

`getHttpClient` returns a plain object — no class needed:

```typescript
export function getHttpClient (resolveCaptchaToken: CaptchaTokenResolver): HttpClient {
  return {
    getCaptchaToken: resolveCaptchaToken,
    async get<T>(url: string, options?: Partial<HttpClientOptions>): Promise<T> { ... },
    async post<T>(url: string, body: object, options?: Partial<HttpClientOptions>): Promise<T> { ... }
  }
}
```

Use a factory function returning an object literal when a class adds no value.

---

## 8. Async Patterns

### Primary: `async/await`

All public async methods use `async/await`. `.then()` is used only in internal
implementation details, not in public-facing code.

### Dynamic `import()` for lazy-loaded bridges

The initialization module loads bridge packages dynamically, enabling tree-shaking
and lazy loading:

```typescript
case 'flyover': {
  const flyoverPkg = await import('@rsksmart/flyover-sdk')
  return new flyoverPkg.Flyover(config as FlyoverConfig)
}
```

Bridge SDK packages (`flyover-sdk`, `tokenbridge-sdk`) are `devDependencies` — loaded at
runtime by consumers. If the package is missing, `convertToBridgeError` catches
`ERR_MODULE_NOT_FOUND` and returns a friendly `BridgeError`.

### `no-return-await` enforced

ESLint enforces `no-return-await`. Do not write `return await promise` in non-`try` contexts.

---

## 9. Configuration & Initialization Patterns

### Layered config interfaces (base + per-bridge extension)

```typescript
export interface BridgesConfig {
  network: Network
  allowInsecureConnections?: boolean
  rskConnection?: Connection
}

export interface FlyoverConfig extends BridgesConfig {
  captchaTokenResolver: CaptchaTokenResolver
  customLbcAddress?: string
  customRegtestUrl?: string
  disableChecksum?: boolean
}
```

New bridges add a new interface extending `BridgesConfig` in `src/config/`.

### `init()` merges shared fields into per-bridge config

Common fields (`network`, `allowInsecureConnections`, `rskConnection`) from the top-level
config are spread into each bridge's specific config. Don't duplicate these fields in
per-bridge configs.

```typescript
const config: SpecificBridgeConfig = {
  ...particularConfig,
  network: initConfig.network,
  allowInsecureConnections: initConfig.allowInsecureConnections,
  rskConnection: initConfig.rskConnection
}
```

### Captcha resolver as injected dependency

Captcha resolution is a required callback, not a hardcoded mechanism:

```typescript
captchaTokenResolver: () => Promise<string>
```

### Immutable shared constants via `deepFreeze`

```typescript
export const tokens = deepFreeze({
  BTC: 'BTC',
  rBTC: 'rBTC'
} as const)
```

---

## 10. Validation Patterns

### No schema libraries

No Zod, Joi, Yup, or class-validator. All validation is hand-rolled.

### Regex-based address validation

Module-level compiled regexes, tested with `.some(regex => regex.test(address))`:

```typescript
export function isBtcAddress (address: string): boolean {
  return [
    BTC_MAINNET_P2PKH_ADDRESS_REGEX,
    BTC_MAINNET_P2SH_ADDRESS_REGEX,
    BTC_MAINNET_P2WPKH_ADDRESS_REGEX,
    BTC_MAINNET_P2WSH_ADDRESS_REGEX,
    // ...
  ].some(regex => regex.test(address))
}
```

### Boolean predicates vs throwing validators

| Pattern | Function | Behavior |
|---|---|---|
| Returns boolean | `isBtcAddress`, `isRskAddress`, `isSecureUrl` | Never throws, returns `true/false` |
| Throws on failure | `validateRequiredFields`, `assertTruthy`, `decodeBtcAddress` | Throws `Error` on invalid input |

### `assertTruthy<T>` for type narrowing

```typescript
export function assertTruthy<T> (
  value: T | undefined | null,
  message = 'unexpected falsy value'
): asserts value is T {
  if (value === undefined || value === null || value === '' || value === false || value === 0 || (typeof value === 'number' && isNaN(value))) {
    throw new Error(message)
  }
}
```

Use `assertTruthy` to narrow optional types to definite types after a guard check.

---

## 11. HTTP Client Patterns

### Interface-driven, factory-created

`HttpClient` is an interface. `getHttpClient(captchaTokenResolver)` is the factory.
No `HttpClient` class exists — the return value is an object literal.

### Transport

`cross-fetch` provides isomorphic `fetch` (Node + browser). Import it as:
```typescript
import fetch from 'cross-fetch'
```

### BigInt-safe JSON serialization

```typescript
const serializer = JSONbig({ useNativeBigInt: true })
// POST body:  serializer.stringify(body)
// Response:   serializer.parse(text)
```

Always use `json-bigint` for serializing bridge responses — never `JSON.parse`/`JSON.stringify`
directly, as contract values may exceed JavaScript's safe integer range.

### Error mapping

HTTP ≥ 400 responses are parsed as JSON and re-thrown as `BridgeError` with the server's
fields (`message`, `timestamp`, `recoverable`, `details`, `serverUrl`).

### No retry or timeout logic

There is no retry, timeout, or interceptor mechanism in the HTTP client. This is intentional —
keep the core SDK thin.

---

## 12. CI / GitHub Actions Patterns

### All actions pinned by commit SHA

```yaml
uses: actions/checkout@08c6903cd8c0fde910a37f88322edcfb5dd907a8 # v4.x.x
```

Always include the human-readable version as a comment alongside the SHA.

### Minimum-privilege permissions model

Default permissions are `contents: read`. Elevated permissions are declared only on
the specific job that needs them:

```yaml
permissions:
  contents: read       # default on workflow
jobs:
  publish:
    permissions:
      id-token: write  # only this job needs OIDC
      contents: read
```

### Build output dir is `lib/`

The publish workflow cleans `lib/` before building, not `dist/`:
```yaml
- name: Clean install dependencies
  run: |
    rm -rf lib
    npm ci
```

### Pre-commit hooks

The repo uses pre-commit (`.pre-commit-config.yaml`) which runs on `.ts`/`.js` changes:
- gitleaks (secret detection)
- shellcheck
- trailing-whitespace
- `npm run lint:validation`
- `npm run test`

---

## 13. Documentation Conventions

### JSDoc on public API only

Document: class static factories, public interface fields, config interfaces.

Do not document: internal/private functions, utility helpers with self-explanatory names,
`crossFetch.ts` internals.

### `@throws` tag is aspirational, not enforced

The `@throws { FlyoverError }` tags in `BlockchainConnection` JSDoc reference `FlyoverError`
but the code throws `BridgeError`. Keep `@throws` tags accurate.

### Complex domain knowledge goes in test comments

When a test covers non-obvious encoding logic (e.g. Bitcoin address byte layouts),
explain it in a block comment inside the test rather than in source JSDoc.

---

## Quick Reference

| Decision | Choice |
|---|---|
| Error class | Single `BridgeError`; plain `Error` for validation |
| Test location | Co-located `*.test.ts`, no `__tests__/` |
| Test naming | `describe('X should', () => { test('behavior') })` |
| Async errors in tests | `.rejects.toThrow()` preferred over `try/catch` |
| Exports | Named only, barrel `index.ts`, no `export default` |
| Class constructors | Private + static factory when creation can fail |
| Config | Layered interfaces extending `BridgesConfig` |
| Validation | Hand-rolled regex/boolean predicates; `assertTruthy` for narrowing |
| JSON | Always `json-bigint` for bridge data |
| Build output | `lib/` (not `dist/`) |
| CI pinning | SHA + version comment |
