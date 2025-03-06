[@rsksmart/bridges-core-sdk](../README.md) / [Exports](../modules.md) / BridgesConfig

# Interface: BridgesConfig

## Hierarchy

- **`BridgesConfig`**

  ↳ [`FlyoverConfig`](FlyoverConfig.md)

  ↳ [`TokenBridgeConfig`](TokenBridgeConfig.md)

## Table of contents

### Properties

- [allowInsecureConnections](BridgesConfig.md#allowinsecureconnections)
- [network](BridgesConfig.md#network)
- [rskConnection](BridgesConfig.md#rskconnection)

## Properties

### allowInsecureConnections

• `Optional` **allowInsecureConnections**: `boolean`

If true http connections will be allowed, otherwise client will throw an error if the connection is not secured

**`Default`**

```ts
false
```

#### Defined in

[config/index.ts:13](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/index.ts#L13)

___

### network

• **network**: [`Network`](../modules.md#network)

Is the name of the network that the client will be using

#### Defined in

[config/index.ts:8](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/index.ts#L8)

___

### rskConnection

• `Optional` **rskConnection**: [`BlockchainConnection`](../classes/BlockchainConnection.md)

Is an object that represnts the connection to the RSK network. It may be obtained using [BlockchainConnection.createUsingStandard](../classes/BlockchainConnection.md#createusingstandard),
[BlockchainConnection.createUsingEncryptedJson](../classes/BlockchainConnection.md#createusingencryptedjson) or [BlockchainConnection.createUsingPassphrase](../classes/BlockchainConnection.md#createusingpassphrase). This configuration is optional because
it is intended to be used on operations that require direct connection to the Liquidity Bridge Contract from SDK, users who are only
interested on operations that use Liquidity Provider Server don't have to provide it

#### Defined in

[config/index.ts:20](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/index.ts#L20)
