[@rsksmart/bridges-core-sdk](../README.md) / [Exports](../modules.md) / Bridge

# Interface: Bridge

Interface with common operations to know the capabilities of every bridge product

## Table of contents

### Properties

- [getMetadata](Bridge.md#getmetadata)
- [supportsConversion](Bridge.md#supportsconversion)
- [supportsNetwork](Bridge.md#supportsnetwork)

## Properties

### getMetadata

• **getMetadata**: () => `Promise`\<[`BridgeMetadata`](BridgeMetadata.md)[]\>

Get information about the conditions of the bridge services

#### Type declaration

▸ (): `Promise`\<[`BridgeMetadata`](BridgeMetadata.md)[]\>

##### Returns

`Promise`\<[`BridgeMetadata`](BridgeMetadata.md)[]\>

#### Defined in

[sdk/core.ts:50](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/sdk/core.ts#L50)

___

### supportsConversion

• **supportsConversion**: (`fromToken`: `string`, `toToken`: `string`) => `boolean`

Check if the implementing bridge supports a specific token conversion

#### Type declaration

▸ (`fromToken`, `toToken`): `boolean`

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fromToken` | `string` | origin token |
| `toToken` | `string` | destination token |

##### Returns

`boolean`

#### Defined in

[sdk/core.ts:44](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/sdk/core.ts#L44)

___

### supportsNetwork

• **supportsNetwork**: (`chainId`: `number`) => `boolean`

Check if the implementing bridge supports a specific network

#### Type declaration

▸ (`chainId`): `boolean`

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chainId` | `number` | the chain ID |

##### Returns

`boolean`

#### Defined in

[sdk/core.ts:58](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/sdk/core.ts#L58)
