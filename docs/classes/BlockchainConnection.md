[@rsksmart/bridges-core-sdk](../README.md) / [Exports](../modules.md) / BlockchainConnection

# Class: BlockchainConnection

Class that represents a connection to the blockchain, this allows to interact with
some smart contract functions that the SDK requires

## Implements

- [`Connection`](../interfaces/Connection.md)

## Table of contents

### Constructors

- [constructor](BlockchainConnection.md#constructor)

### Properties

- [\_signer](BlockchainConnection.md#_signer)

### Accessors

- [signer](BlockchainConnection.md#signer)

### Methods

- [getAbstraction](BlockchainConnection.md#getabstraction)
- [getChainHeight](BlockchainConnection.md#getchainheight)
- [getChainId](BlockchainConnection.md#getchainid)
- [getConnectedAddress](BlockchainConnection.md#getconnectedaddress)
- [getTransactionReceipt](BlockchainConnection.md#gettransactionreceipt)
- [createUsingEncryptedJson](BlockchainConnection.md#createusingencryptedjson)
- [createUsingPassphrase](BlockchainConnection.md#createusingpassphrase)
- [createUsingStandard](BlockchainConnection.md#createusingstandard)

## Constructors

### constructor

• **new BlockchainConnection**(`_signer`): [`BlockchainConnection`](BlockchainConnection.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_signer` | `Signer` |

#### Returns

[`BlockchainConnection`](BlockchainConnection.md)

#### Defined in

[blockchain/blockchain.ts:57](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L57)

## Properties

### \_signer

• `Private` `Readonly` **\_signer**: `Signer`

#### Defined in

[blockchain/blockchain.ts:58](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L58)

## Accessors

### signer

• `get` **signer**(): `Signer`

Getter for ethers.Signer used object. This object represents a read/write connection to the blockchain

#### Returns

`Signer`

signer

#### Defined in

[blockchain/blockchain.ts:148](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L148)

## Methods

### getAbstraction

▸ **getAbstraction**(): `Signer` \| `Provider`

#### Returns

`Signer` \| `Provider`

#### Implementation of

[Connection](../interfaces/Connection.md).[getAbstraction](../interfaces/Connection.md#getabstraction)

#### Defined in

[blockchain/blockchain.ts:156](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L156)

___

### getChainHeight

▸ **getChainHeight**(): `Promise`\<`undefined` \| `number`\>

#### Returns

`Promise`\<`undefined` \| `number`\>

#### Implementation of

[Connection](../interfaces/Connection.md).[getChainHeight](../interfaces/Connection.md#getchainheight)

#### Defined in

[blockchain/blockchain.ts:139](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L139)

___

### getChainId

▸ **getChainId**(): `Promise`\<`number`\>

#### Returns

`Promise`\<`number`\>

#### Implementation of

[Connection](../interfaces/Connection.md).[getChainId](../interfaces/Connection.md#getchainid)

#### Defined in

[blockchain/blockchain.ts:152](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L152)

___

### getConnectedAddress

▸ **getConnectedAddress**(): `Promise`\<`string`\>

Returns authenticated signer address

#### Returns

`Promise`\<`string`\>

signer address

#### Defined in

[blockchain/blockchain.ts:135](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L135)

___

### getTransactionReceipt

▸ **getTransactionReceipt**(`tx`): `Promise`\<``null`` \| `ContractReceipt`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `string` |

#### Returns

`Promise`\<``null`` \| `ContractReceipt`\>

#### Implementation of

[Connection](../interfaces/Connection.md).[getTransactionReceipt](../interfaces/Connection.md#gettransactionreceipt)

#### Defined in

[blockchain/blockchain.ts:160](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L160)

___

### createUsingEncryptedJson

▸ **createUsingEncryptedJson**(`json`, `password`, `url?`): `Promise`\<[`BlockchainConnection`](BlockchainConnection.md)\>

Creates connection object using encrypted json and its password. This method allows
SDK usage from server side. This method uses ethers.providers.JsonRpcProvider internally to
generate the connection.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `json` | `any` | `undefined` | encrypted json |
| `password` | `string` | `undefined` | encrypted json encryption password |
| `url` | `string` | `DEFAULT_NODE_URL` | node url, by default it is RSK testnet public node |

#### Returns

`Promise`\<[`BlockchainConnection`](BlockchainConnection.md)\>

Connection object

**`Throws`**

On faliled connection

#### Defined in

[blockchain/blockchain.ts:94](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L94)

___

### createUsingPassphrase

▸ **createUsingPassphrase**(`passphrase`, `url?`): `Promise`\<[`BlockchainConnection`](BlockchainConnection.md)\>

Creates connection object using a passphrase. This method allows SDK usage
from server side. This method uses ethers.providers.JsonRpcProvider internally to
generate the connection.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `passphrase` | `string` | `undefined` | account passphrase |
| `url` | `string` | `DEFAULT_NODE_URL` | node url, by default it is RSK testnet public node |

#### Returns

`Promise`\<[`BlockchainConnection`](BlockchainConnection.md)\>

Connection object

**`Throws`**

On faliled connection

#### Defined in

[blockchain/blockchain.ts:118](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L118)

___

### createUsingStandard

▸ **createUsingStandard**(`standard`): `Promise`\<[`BlockchainConnection`](BlockchainConnection.md)\>

Creates the connection object using a EIP-1193 standard. This allows SDK compatibility with wallets
like Metamask or any other wallet that injects the window.ethereum object in browser. This method
uses ethers.providers.Web3Provider internally to generate the connection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `standard` | `ExternalProvider` | EIP-1193 standard object, e.g., window.ethereum |

#### Returns

`Promise`\<[`BlockchainConnection`](BlockchainConnection.md)\>

Connection object

**`Throws`**

On faliled connection

#### Defined in

[blockchain/blockchain.ts:72](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/blockchain/blockchain.ts#L72)
