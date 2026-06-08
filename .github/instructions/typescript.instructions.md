---
applyTo: "src/**/*.ts"
---

# TypeScript Conventions — bridges-core-sdk

## Types vs interfaces

- Use `interface` for object shapes, class `implements` targets, and config hierarchies.
- Use `type` for union literals, mapped types, and function signatures.

```typescript
// correct
export type Network = 'Mainnet' | 'Testnet' | 'Regtest' | 'Alphanet' | 'Development'
export type CaptchaTokenResolver = () => Promise<string>
export interface HttpClient { get: <T>(...) => Promise<T> }

// wrong — union as interface, contract as type
export interface Network { }
export type HttpClient = { get: ... }
```

## Type-only imports

Always use inline `type` keyword for type-only imports:

```typescript
import { type BridgesConfig } from '.'
import { type CaptchaTokenResolver } from '../client'
```

## Class design

- Use **private constructor + static async factory methods** for classes whose construction can fail asynchronously. Note: downstream SDKs (e.g. flyover-sdk) may use public constructors with their own initialization logic — that is correct for those packages. Within bridges-core-sdk, prefer the static factory pattern:

```typescript
export class BlockchainConnection implements Connection {
  private constructor (private readonly _signer: Signer) {}

  static async createUsingRpc (rpcUrl: string): Promise<BlockchainConnection> { ... }
}
```

- Use a **factory function returning an object literal** when a class adds no value:

```typescript
export function getHttpClient (resolver: CaptchaTokenResolver): HttpClient {
  return {
    getCaptchaToken: resolver,
    async get<T>(url: string): Promise<T> { ... }
  }
}
```

- Private backing fields use underscore prefix and are exposed via a public getter:

```typescript
private readonly _signer: Signer
get signer (): Signer { return this._signer }
```

- Use `implements` against an interface. Do not extend other domain classes.
- No abstract classes. No decorators.

## Generics

Use generics sparingly. Appropriate uses: type-narrowing assertions, generic return types on interface methods, `deepFreeze<T>`.

## Strict compliance

- No `any` outside of catch blocks, test mocks, or `BridgeError.details`.
- All `noUnused*`, `noImplicit*`, and `noUncheckedIndexedAccess` flags are enabled — do not suppress them with `// @ts-ignore` or `// eslint-disable`.

## Naming

| Thing | Convention |
|---|---|
| Files | camelCase (`crossFetch.ts`, `httpClient.ts`) |
| Classes / Interfaces | PascalCase |
| Functions / variables | camelCase |
| Private fields | `_camelCase` (underscore prefix) |
| Module-private constants | `SCREAMING_SNAKE_CASE` |
| Exported constants | `SCREAMING_SNAKE_CASE` |
| Exported constant objects | camelCase, wrapped in `deepFreeze(... as const)` |

## CI and build

- Build output is `lib/`. Any cleanup step must use `rm -rf lib`, never `rm -rf dist`.
- GitHub Actions must be pinned by full commit SHA with a `# vX.Y.Z` comment.
- Declare the minimum-privilege `permissions` block on every workflow job.
