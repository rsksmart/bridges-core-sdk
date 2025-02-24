[@rsksmart/bridges-core-sdk](../README.md) / [Exports](../modules.md) / Connection

# Interface: Connection

Generalization for the classes that represent a connection to the blockchain

## Implemented by

- [`BlockchainConnection`](../classes/BlockchainConnection.md)
- [`BlockchainReadOnlyConnection`](../classes/BlockchainReadOnlyConnection.md)

## Table of contents

### Properties

- [getAbstraction](Connection.md#getabstraction)
- [getChainHeight](Connection.md#getchainheight)
- [getChainId](Connection.md#getchainid)
- [getTransactionReceipt](Connection.md#gettransactionreceipt)

## Properties

### getAbstraction

• **getAbstraction**: () => `Signer` \| `Provider`

Get the ethers connection object used as abstraction for the connection

#### Type declaration

▸ (): `Signer` \| `Provider`

##### Returns

`Signer` \| `Provider`

#### Defined in

[blockchain/blockchain.ts:41](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L41)

___

### getChainHeight

• **getChainHeight**: () => `Promise`\<`undefined` \| `number`\>

Returns current chain height if the connection is working

#### Type declaration

▸ (): `Promise`\<`undefined` \| `number`\>

##### Returns

`Promise`\<`undefined` \| `number`\>

#### Defined in

[blockchain/blockchain.ts:29](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L29)

___

### getChainId

• **getChainId**: () => `Promise`\<`number`\>

Get the chain ID of the network that this connection was made for

#### Type declaration

▸ (): `Promise`\<`number`\>

##### Returns

`Promise`\<`number`\>

#### Defined in

[blockchain/blockchain.ts:35](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L35)

___

### getTransactionReceipt

• **getTransactionReceipt**: (`tx`: `string`) => `Promise`\<``null`` \| `ContractReceipt`\>

Get the receipt for a specific transaction

#### Type declaration

▸ (`tx`): `Promise`\<``null`` \| `ContractReceipt`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tx` | `string` | the transaction hash |

##### Returns

`Promise`\<``null`` \| `ContractReceipt`\>

#### Defined in

[blockchain/blockchain.ts:49](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L49)
