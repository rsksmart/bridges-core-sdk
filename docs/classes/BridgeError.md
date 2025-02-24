[@rsksmart/bridges-core-sdk](../README.md) / [Exports](../modules.md) / BridgeError

# Class: BridgeError

## Hierarchy

- `Error`

  ↳ **`BridgeError`**

## Table of contents

### Constructors

- [constructor](BridgeError.md#constructor)

### Properties

- [details](BridgeError.md#details)
- [product](BridgeError.md#product)
- [recoverable](BridgeError.md#recoverable)
- [serverUrl](BridgeError.md#serverurl)
- [timestamp](BridgeError.md#timestamp)

## Constructors

### constructor

• **new BridgeError**(`args`): [`BridgeError`](BridgeError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`ErrorDetails`](../interfaces/ErrorDetails.md) |

#### Returns

[`BridgeError`](BridgeError.md)

#### Overrides

Error.constructor

#### Defined in

[client/httpClient.ts:27](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/httpClient.ts#L27)

## Properties

### details

• **details**: `any`

#### Defined in

[client/httpClient.ts:24](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/httpClient.ts#L24)

___

### product

• `Optional` **product**: `string`

#### Defined in

[client/httpClient.ts:26](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/httpClient.ts#L26)

___

### recoverable

• **recoverable**: `boolean`

#### Defined in

[client/httpClient.ts:23](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/httpClient.ts#L23)

___

### serverUrl

• `Optional` **serverUrl**: `string`

#### Defined in

[client/httpClient.ts:25](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/httpClient.ts#L25)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[client/httpClient.ts:22](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/httpClient.ts#L22)
