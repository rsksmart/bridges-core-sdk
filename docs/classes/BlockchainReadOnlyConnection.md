[@rsksmart/bridges-core-sdk](../README.md) / [Exports](../modules.md) / BlockchainReadOnlyConnection

# Class: BlockchainReadOnlyConnection

Class that represents a readonly connection to the blockchain, this allows to interact with
some smart contract views that the SDK requires. All the state-changing functions executed
with this class should throw an error

## Implements

- [`Connection`](../interfaces/Connection.md)

## Table of contents

### Constructors

- [constructor](BlockchainReadOnlyConnection.md#constructor)

### Properties

- [\_provider](BlockchainReadOnlyConnection.md#_provider)

### Methods

- [getAbstraction](BlockchainReadOnlyConnection.md#getabstraction)
- [getChainHeight](BlockchainReadOnlyConnection.md#getchainheight)
- [getChainId](BlockchainReadOnlyConnection.md#getchainid)
- [getTransactionReceipt](BlockchainReadOnlyConnection.md#gettransactionreceipt)
- [createUsingRpc](BlockchainReadOnlyConnection.md#createusingrpc)

## Constructors

### constructor

• **new BlockchainReadOnlyConnection**(`_provider`): [`BlockchainReadOnlyConnection`](BlockchainReadOnlyConnection.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_provider` | `Provider` |

#### Returns

[`BlockchainReadOnlyConnection`](BlockchainReadOnlyConnection.md)

#### Defined in

[blockchain/blockchain.ts:171](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L171)

## Properties

### \_provider

• `Private` `Readonly` **\_provider**: `Provider`

#### Defined in

[blockchain/blockchain.ts:172](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L172)

## Methods

### getAbstraction

▸ **getAbstraction**(): `Signer` \| `Provider`

#### Returns

`Signer` \| `Provider`

#### Implementation of

[Connection](../interfaces/Connection.md).[getAbstraction](../interfaces/Connection.md#getabstraction)

#### Defined in

[blockchain/blockchain.ts:198](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L198)

___

### getChainHeight

▸ **getChainHeight**(): `Promise`\<`undefined` \| `number`\>

#### Returns

`Promise`\<`undefined` \| `number`\>

#### Implementation of

[Connection](../interfaces/Connection.md).[getChainHeight](../interfaces/Connection.md#getchainheight)

#### Defined in

[blockchain/blockchain.ts:190](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L190)

___

### getChainId

▸ **getChainId**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Implementation of

[Connection](../interfaces/Connection.md).[getChainId](../interfaces/Connection.md#getchainid)

#### Defined in

[blockchain/blockchain.ts:194](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L194)

___

### getTransactionReceipt

▸ **getTransactionReceipt**(`tx`): `Promise`\<`ContractReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` |

#### Returns

`Promise`\<`ContractReceipt`\>

#### Implementation of

[Connection](../interfaces/Connection.md).[getTransactionReceipt](../interfaces/Connection.md#gettransactionreceipt)

#### Defined in

[blockchain/blockchain.ts:202](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L202)

___

### createUsingRpc

▸ **createUsingRpc**(`rpcUrl`): `Promise`\<[`BlockchainReadOnlyConnection`](BlockchainReadOnlyConnection.md)\>

Creates the connection object using a RPC server, it uses  ethers.providers.JsonRpcProvider
internally to create the connection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rpcUrl` | `string` | the url of the JSON RPC server |

#### Returns

`Promise`\<[`BlockchainReadOnlyConnection`](BlockchainReadOnlyConnection.md)\>

Connection object

**`Throws`**

On faliled connection

#### Defined in

[blockchain/blockchain.ts:185](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L185)
