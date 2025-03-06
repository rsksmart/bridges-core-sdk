[@rsksmart/bridges-core-sdk](README.md) / Exports

# @rsksmart/bridges-core-sdk

## Table of contents

### Classes

- [BlockchainConnection](classes/BlockchainConnection.md)
- [BlockchainReadOnlyConnection](classes/BlockchainReadOnlyConnection.md)
- [BridgeError](classes/BridgeError.md)

### Interfaces

- [Bridge](interfaces/Bridge.md)
- [BridgeMetadata](interfaces/BridgeMetadata.md)
- [BridgesConfig](interfaces/BridgesConfig.md)
- [Connection](interfaces/Connection.md)
- [ErrorDetails](interfaces/ErrorDetails.md)
- [Fee](interfaces/Fee.md)
- [FlyoverConfig](interfaces/FlyoverConfig.md)
- [HttpClient](interfaces/HttpClient.md)
- [HttpClientOptions](interfaces/HttpClientOptions.md)
- [TokenBridgeConfig](interfaces/TokenBridgeConfig.md)
- [TxResult](interfaces/TxResult.md)

### Type Aliases

- [CaptchaTokenResolver](modules.md#captchatokenresolver)
- [Confirmations](modules.md#confirmations)
- [Network](modules.md#network)

### Variables

- [BTC\_ZERO\_ADDRESS\_MAINNET](modules.md#btc_zero_address_mainnet)
- [BTC\_ZERO\_ADDRESS\_TESTNET](modules.md#btc_zero_address_testnet)
- [tokens](modules.md#tokens)

### Functions

- [assertTruthy](modules.md#asserttruthy)
- [decodeBtcAddress](modules.md#decodebtcaddress)
- [deepFreeze](modules.md#deepfreeze)
- [estimateGas](modules.md#estimategas)
- [executeContractFunction](modules.md#executecontractfunction)
- [executeContractView](modules.md#executecontractview)
- [getHttpClient](modules.md#gethttpclient)
- [getProperBridges](modules.md#getproperbridges)
- [isBtcAddress](modules.md#isbtcaddress)
- [isBtcMainnetAddress](modules.md#isbtcmainnetaddress)
- [isBtcNativeSegwitAddress](modules.md#isbtcnativesegwitaddress)
- [isBtcTestnetAddress](modules.md#isbtctestnetaddress)
- [isBtcZeroAddress](modules.md#isbtczeroaddress)
- [isLegacyBtcAddress](modules.md#islegacybtcaddress)
- [isRskAddress](modules.md#isrskaddress)
- [isRskChecksummedAddress](modules.md#isrskchecksummedaddress)
- [isSecureUrl](modules.md#issecureurl)
- [isTaprootAddress](modules.md#istaprootaddress)
- [isValidSignature](modules.md#isvalidsignature)
- [rskChecksum](modules.md#rskchecksum)
- [throwErrorIfFailedTx](modules.md#throwerroriffailedtx)
- [validateRequiredFields](modules.md#validaterequiredfields)

## Type Aliases

### CaptchaTokenResolver

Ƭ **CaptchaTokenResolver**: () => `Promise`\<`string`\>

#### Type declaration

▸ (): `Promise`\<`string`\>

##### Returns

`Promise`\<`string`\>

#### Defined in

[client/httpClient.ts:11](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/httpClient.ts#L11)

___

### Confirmations

Ƭ **Confirmations**: `Map`\<`bigint`, `number`\>

#### Defined in

[sdk/core.ts:23](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/sdk/core.ts#L23)

___

### Network

Ƭ **Network**: ``"Mainnet"`` \| ``"Testnet"`` \| ``"Regtest"`` \| ``"Alphanet"`` \| ``"Development"``

Available network options

#### Defined in

[config/index.ts:4](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/config/index.ts#L4)

## Variables

### BTC\_ZERO\_ADDRESS\_MAINNET

• `Const` **BTC\_ZERO\_ADDRESS\_MAINNET**: ``"1111111111111111111114oLvT2"``

#### Defined in

[utils/validation.ts:30](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L30)

___

### BTC\_ZERO\_ADDRESS\_TESTNET

• `Const` **BTC\_ZERO\_ADDRESS\_TESTNET**: ``"mfWxJ45yp2SFn7UciZyNpvDKrzbhyfKrY8"``

#### Defined in

[utils/validation.ts:31](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L31)

___

### tokens

• `Const` **tokens**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `BTC` | ``"BTC"`` |
| `rBTC` | ``"rBTC"`` |

#### Defined in

[common/tokens.ts:3](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/common/tokens.ts#L3)

## Functions

### assertTruthy

▸ **assertTruthy**\<`T`\>(`value`, `message?`): asserts value is T

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `undefined` \| ``null`` \| `T` | `undefined` |
| `message` | `string` | `'unexpected falsy value'` |

#### Returns

asserts value is T

#### Defined in

[utils/validation.ts:135](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L135)

___

### decodeBtcAddress

▸ **decodeBtcAddress**(`address`, `options?`): `Uint8Array`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `options` | `Object` | `undefined` |
| `options.keepChecksum` | `boolean` | `false` |

#### Returns

`Uint8Array`

#### Defined in

[utils/parsing.ts:6](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/parsing.ts#L6)

___

### deepFreeze

▸ **deepFreeze**\<`T`\>(`obj`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `T` |

#### Returns

`T`

#### Defined in

[utils/mutability.ts:2](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/mutability.ts#L2)

___

### estimateGas

▸ **estimateGas**(`contract`, `functionName`, `...params`): `Promise`\<`bigint`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contract` | `Contract` |
| `functionName` | `string` |
| `...params` | `unknown`[] |

#### Returns

`Promise`\<`bigint`\>

#### Defined in

[blockchain/blockchain.ts:255](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L255)

___

### executeContractFunction

▸ **executeContractFunction**(`contract`, `functionName`, `...params`): `Promise`\<[`TxResult`](interfaces/TxResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `contract` | `Contract` |
| `functionName` | `string` |
| `...params` | `unknown`[] |

#### Returns

`Promise`\<[`TxResult`](interfaces/TxResult.md)\>

#### Defined in

[blockchain/blockchain.ts:220](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L220)

___

### executeContractView

▸ **executeContractView**\<`T`\>(`contract`, `functionName`, `...params`): `Promise`\<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `contract` | `Contract` |
| `functionName` | `string` |
| `...params` | `unknown`[] |

#### Returns

`Promise`\<`T`\>

#### Defined in

[blockchain/blockchain.ts:238](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L238)

___

### getHttpClient

▸ **getHttpClient**(`resolveCaptchaToken`): [`HttpClient`](interfaces/HttpClient.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `resolveCaptchaToken` | [`CaptchaTokenResolver`](modules.md#captchatokenresolver) |

#### Returns

[`HttpClient`](interfaces/HttpClient.md)

#### Defined in

[client/crossFetch.ts:7](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/crossFetch.ts#L7)

___

### getProperBridges

▸ **getProperBridges**(`fromToken`, `toToken`, `bridges`): [`Bridge`](interfaces/Bridge.md)[]

Filter the bridges that can perform a specific conversion

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromToken` | `string` | origin token |
| `toToken` | `string` | destination token |
| `bridges` | [`Bridge`](interfaces/Bridge.md)[] | array of initialized bridges to validate |

#### Returns

[`Bridge`](interfaces/Bridge.md)[]

the bridges that are capable of convertin fromToken to toToken

#### Defined in

[sdk/core.ts:10](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/sdk/core.ts#L10)

___

### isBtcAddress

▸ **isBtcAddress**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:49](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L49)

___

### isBtcMainnetAddress

▸ **isBtcMainnetAddress**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:100](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L100)

___

### isBtcNativeSegwitAddress

▸ **isBtcNativeSegwitAddress**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:67](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L67)

___

### isBtcTestnetAddress

▸ **isBtcTestnetAddress**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:87](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L87)

___

### isBtcZeroAddress

▸ **isBtcZeroAddress**(`config`, `address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Object` |
| `config.network` | [`Network`](modules.md#network) |
| `address` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:165](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L165)

___

### isLegacyBtcAddress

▸ **isLegacyBtcAddress**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:110](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L110)

___

### isRskAddress

▸ **isRskAddress**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:119](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L119)

___

### isRskChecksummedAddress

▸ **isRskChecksummedAddress**(`address`, `chainId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `chainId` | ``30`` \| ``31`` \| ``33`` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:161](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L161)

___

### isSecureUrl

▸ **isSecureUrl**(`urlString`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `urlString` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:44](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L44)

___

### isTaprootAddress

▸ **isTaprootAddress**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:79](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L79)

___

### isValidSignature

▸ **isValidSignature**(`address`, `message`, `signature`, `isHexMessage?`): `boolean`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `message` | `string` | `undefined` |
| `signature` | `string` | `undefined` |
| `isHexMessage` | `boolean` | `true` |

#### Returns

`boolean`

#### Defined in

[utils/validation.ts:123](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L123)

___

### rskChecksum

▸ **rskChecksum**(`address`, `chainId`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `chainId` | ``30`` \| ``31`` \| ``33`` |

#### Returns

`string`

#### Defined in

[utils/validation.ts:144](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L144)

___

### throwErrorIfFailedTx

▸ **throwErrorIfFailedTx**(`txResult`, `message?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `txResult` | [`TxResult`](interfaces/TxResult.md) | `undefined` |
| `message` | `string` | `'error executing transaction'` |

#### Returns

`void`

#### Defined in

[blockchain/blockchain.ts:207](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L207)

___

### validateRequiredFields

▸ **validateRequiredFields**(`objectToValidate`, `...requiredFields`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectToValidate` | `object` |
| `...requiredFields` | `string`[] |

#### Returns

`void`

#### Defined in

[utils/validation.ts:33](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/utils/validation.ts#L33)
