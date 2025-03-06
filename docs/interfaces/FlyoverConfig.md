[@rsksmart/bridges-core-sdk](../README.md) / [Exports](../modules.md) / FlyoverConfig

# Interface: FlyoverConfig

Interface for the flyover client connection configuration

## Hierarchy

- [`BridgesConfig`](BridgesConfig.md)

  ↳ **`FlyoverConfig`**

## Table of contents

### Properties

- [allowInsecureConnections](FlyoverConfig.md#allowinsecureconnections)
- [captchaTokenResolver](FlyoverConfig.md#captchatokenresolver)
- [customLbcAddress](FlyoverConfig.md#customlbcaddress)
- [customRegtestUrl](FlyoverConfig.md#customregtesturl)
- [disableChecksum](FlyoverConfig.md#disablechecksum)
- [network](FlyoverConfig.md#network)
- [rskConnection](FlyoverConfig.md#rskconnection)

## Properties

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

Function that will be called to get the captcha token returned from a successful captcha challenge

#### Defined in

[config/flyover.ts:13](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/flyover.ts#L13)

___

### customLbcAddress

• `Optional` **customLbcAddress**: `string`

Is a custom url for users that want to use other LBC, for example, a local one for testing purposes

#### Defined in

[config/flyover.ts:7](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/flyover.ts#L7)

___

### customRegtestUrl

• `Optional` **customRegtestUrl**: `string`

**`Deprecated`**

Will be removed in future releases

#### Defined in

[config/flyover.ts:9](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/flyover.ts#L9)

___

### disableChecksum

• `Optional` **disableChecksum**: `boolean`

Whether to disable the checksum validation for the RSK addresses or not

**`Default`**

```ts
false
```

#### Defined in

[config/flyover.ts:18](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/flyover.ts#L18)

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
