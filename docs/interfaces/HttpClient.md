[@rsksmart/bridges-core-sdk](../README.md) / [Exports](../modules.md) / HttpClient

# Interface: HttpClient

## Table of contents

### Properties

- [get](HttpClient.md#get)
- [getCaptchaToken](HttpClient.md#getcaptchatoken)
- [post](HttpClient.md#post)

## Properties

### get

• **get**: \<T\>(`url`: `string`, `options?`: `Partial`\<[`HttpClientOptions`](HttpClientOptions.md)\>) => `Promise`\<`T`\>

#### Type declaration

▸ \<`T`\>(`url`, `options?`): `Promise`\<`T`\>

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `options?` | `Partial`\<[`HttpClientOptions`](HttpClientOptions.md)\> |

##### Returns

`Promise`\<`T`\>

#### Defined in

[client/httpClient.ts:6](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/httpClient.ts#L6)

___

### getCaptchaToken

• **getCaptchaToken**: [`CaptchaTokenResolver`](../modules.md#captchatokenresolver)

#### Defined in

[client/httpClient.ts:8](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/httpClient.ts#L8)

___

### post

• **post**: \<T\>(`url`: `string`, `body`: `object`, `options?`: `Partial`\<[`HttpClientOptions`](HttpClientOptions.md)\>) => `Promise`\<`T`\>

#### Type declaration

▸ \<`T`\>(`url`, `body`, `options?`): `Promise`\<`T`\>

##### Type parameters

| Name |
| :------ |
| `T` |

##### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `body` | `object` |
| `options?` | `Partial`\<[`HttpClientOptions`](HttpClientOptions.md)\> |

##### Returns

`Promise`\<`T`\>

#### Defined in

[client/httpClient.ts:7](https://github.com/rsksmart/bridges-core-sdk/blob/0e235bb7c0efe3213e0c46ed267b8cbbc0c6f036/src/client/httpClient.ts#L7)
