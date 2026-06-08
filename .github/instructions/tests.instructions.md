---
applyTo: "src/**/*.test.ts"
---

# Test Conventions — bridges-core-sdk

## File placement

Test files are co-located with their source file in the same directory:

```
src/blockchain/blockchain.ts
src/blockchain/blockchain.test.ts   ✓ correct
src/__tests__/blockchain.test.ts    ✗ wrong
```

## Imports

Always use `@jest/globals` explicit imports — never rely on Jest globals:

```typescript
import { describe, test, expect, jest, beforeAll, beforeEach } from '@jest/globals'
```

## describe / test naming

The word **"should"** belongs in the `describe` block, not in the `test` name:

```typescript
// correct
describe('validateRequiredFields function should', () => {
  test('throw if a required field is missing', () => { ... })
  test('not throw when all fields are present', () => { ... })
})

// wrong
describe('validateRequiredFields', () => {
  it('should throw if a required field is missing', () => { ... })
})
```

## Asserting async errors — prefer `.rejects`

Use `.rejects.toThrow()` or `.rejects.toMatchObject()` for async error assertions. Do not use `try/catch` in tests unless you need to assert on both the error class and its properties simultaneously — in that case guard with `expect.assertions(n)`:

```typescript
// preferred
await expect(callContractFunction(mock, 'failMethod')).rejects.toThrow(BridgeError)

// acceptable only when asserting class + properties
expect.assertions(3)
await callContractFunction(mock, 'failMethod').catch(e => {
  expect(e).toBeInstanceOf(BridgeError)
  expect(e.recoverable).toBe(true)
  expect(e.details).toMatchObject({ ... })
})

// wrong — bare try/catch
try {
  await callContractFunction(mock, 'failMethod')
} catch (e) {
  expect(e).toBeInstanceOf(BridgeError)
}
```

## Mocking

Module mocks are declared at the top of the file with `jest.mock`:

```typescript
jest.mock('ethers')
jest.mock('cross-fetch')
```

Use `jest.spyOn` for partial mocks when you only want to override one method:

```typescript
const spy = jest.spyOn(bech32m, 'decode')
```

Manual mock objects for complex types (ethers signer, provider, contract) are defined as `any` and reset in `beforeEach`.

## Lifecycle hooks

| Hook | When to use |
|---|---|
| `beforeAll` | Create shared instances (e.g. `BlockchainConnection`) or heavy mocks used across all tests |
| `beforeEach` | Reset per-test state (e.g. mock return values, counters) |
| `afterEach` | `jest.clearAllMocks()` when mocks need explicit clearing |
| `afterAll` | Not used in this repo |

## Assertions reference

| Pattern | Use |
|---|---|
| `expect(x).toBe(y)` | Primitives, booleans, reference equality |
| `expect(x).toEqual(y)` | Deep equality for objects and arrays |
| `expect(x).toBeInstanceOf(BridgeError)` | Error type checks |
| `expect(() => fn()).toThrow(BridgeError)` | Synchronous throws |
| `await expect(p).rejects.toThrow(BridgeError)` | Async throws (preferred) |
| `expect(mock).toHaveBeenCalledTimes(n)` | Mock call count |
| `it.each([...])('%s', ...)` | Parameterised input variants |

## Integration tests

Integration tests live in `integration-test/` (a separate npm package), not in `src/`.
They are never run in CI — they require a live network. Do not add network calls or real RPC usage to `src/**/*.test.ts`.
