[@rsksmart/bridges-core-sdk](../README.md) / [Exports](../modules.md) / TokenBridgeConfig

# Interface: TokenBridgeConfig

## Hierarchy

- [`BridgesConfig`](BridgesConfig.md)

  ↳ **`TokenBridgeConfig`**

## Table of contents

### Properties

- [Regtest](TokenBridgeConfig.md#regtest)
- [allowInsecureConnections](TokenBridgeConfig.md#allowinsecureconnections)
- [captchaTokenResolver](TokenBridgeConfig.md#captchatokenresolver)
- [network](TokenBridgeConfig.md#network)
- [rskConnection](TokenBridgeConfig.md#rskconnection)

## Properties

### Regtest

• `Optional` **Regtest**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `apiURL?` | `string` |

#### Defined in

[config/tokenbridge.ts:6](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/tokenbridge.ts#L6)

___

### allowInsecureConnections

• `Optional` **allowInsecureConnections**: `boolean`

If true http connections will be allowed, otherwise client will throw an error if the connection is not secured

**`Default`**

```ts
false
```

#### Inherited from

[BridgesConfig](BridgesConfig.md).[allowInsecureConnections](BridgesConfig.md#allowinsecureconnections)

#### Defined in

[config/index.ts:13](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/index.ts#L13)

___

### captchaTokenResolver

• **captchaTokenResolver**: [`CaptchaTokenResolver`](../modules.md#captchatokenresolver)

#### Defined in

[config/tokenbridge.ts:5](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/tokenbridge.ts#L5)

___

### network

• **network**: [`Network`](../modules.md#network)

Is the name of the network that the client will be using

#### Inherited from

[BridgesConfig](BridgesConfig.md).[network](BridgesConfig.md#network)

#### Defined in

[config/index.ts:8](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/index.ts#L8)

___

### rskConnection

• `Optional` **rskConnection**: [`BlockchainConnection`](../classes/BlockchainConnection.md)

Is an object that represnts the connection to the RSK network. It may be obtained using [BlockchainConnection.createUsingStandard](../classes/BlockchainConnection.md#createusingstandard),
[BlockchainConnection.createUsingEncryptedJson](../classes/BlockchainConnection.md#createusingencryptedjson) or [BlockchainConnection.createUsingPassphrase](../classes/BlockchainConnection.md#createusingpassphrase). This configuration is optional because
it is intended to be used on operations that require direct connection to the Liquidity Bridge Contract from SDK, users who are only
interested on operations that use Liquidity Provider Server don't have to provide it

#### Inherited from

[BridgesConfig](BridgesConfig.md).[rskConnection](BridgesConfig.md#rskconnection)

#### Defined in

[config/index.ts:20](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/index.ts#L20)
