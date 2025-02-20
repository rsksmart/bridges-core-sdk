import { describe, test, jest, expect, beforeAll } from '@jest/globals'
import { estimateGas, executeContractFunction, BlockchainConnection, throwErrorIfFailedTx } from './blockchain'
import * as ethers from 'ethers'
import JSONbig from 'json-bigint'
import { BridgeError } from '../client/httpClient'

const serializer = JSONbig({ useNativeBigInt: true })

jest.mock('ethers')
const signerMock = {
  provider: { getBlockNumber: async () => Promise.resolve(1) },
  getAddress: async () => Promise.resolve('0x9D93929A9099be4355fC2389FbF253982F9dF47c')
}

const providerMock: any = {
  getSigner: async () => Promise.resolve(signerMock),
  getNetwork: jest.fn().mockImplementation(async () => Promise.resolve(true))
}

describe('BlockchainConnection factories should', () => {
  test('use browser provider on standard creation', async () => {
    const providerClassMock = jest.mocked(ethers.providers.Web3Provider)
    providerClassMock.mockImplementation(() => providerMock)

    const rsk = await BlockchainConnection.createUsingStandard({} as any)

    expect(ethers.providers.Web3Provider).toBeCalledTimes(1)
    expect(rsk).not.toHaveProperty('_signer', undefined)
  })

  test('use rpc provider on encrypted json creation', async () => {
    const providerClassMock = jest.mocked(ethers.providers.JsonRpcProvider)
    providerClassMock.mockImplementation(() => providerMock)
    ethers.Wallet.fromEncryptedJson = jest.fn<typeof ethers.Wallet.fromEncryptedJson>()
      .mockResolvedValue({
        connect: () => signerMock
      } as any)

    const rsk = await BlockchainConnection.createUsingEncryptedJson('json', 'pass')

    expect(providerMock.getNetwork).toBeCalledTimes(1)
    expect(ethers.providers.JsonRpcProvider).toBeCalledTimes(1)
    expect(rsk).not.toHaveProperty('_signer', undefined)
  })

  test('use rpc provider on passphrase creation', async () => {
    const providerClassMock = jest.mocked(ethers.providers.JsonRpcProvider)
    providerClassMock.mockImplementation(() => providerMock)
    ethers.Wallet.fromMnemonic = jest.fn<typeof ethers.Wallet.fromMnemonic>()
      .mockReturnValue({
        connect: () => signerMock
      } as any)

    const rsk = await BlockchainConnection.createUsingPassphrase('pass')

    expect(providerMock.getNetwork).toBeCalledTimes(1)
    expect(ethers.providers.JsonRpcProvider).toBeCalledTimes(1)
    expect(rsk).not.toHaveProperty('_signer', undefined)
  })

  test('throw error if not conected to network', async () => {
    const providerClassMock = jest.mocked(ethers.providers.JsonRpcProvider)
    providerClassMock.mockImplementation(() => {
      return {
        getSigner: async () => Promise.resolve(signerMock),
        getNetwork: async () => Promise.reject(new Error('some error'))
      } as any
    })

    expect.assertions(4)
    await BlockchainConnection.createUsingPassphrase('pass').catch(e => {
      expect(e).toBeInstanceOf(BridgeError)
      expect(e.message).toBe('error getting authenticated signer')
    })
    await BlockchainConnection.createUsingEncryptedJson('json', 'pass').catch(e => {
      expect(e).toBeInstanceOf(BridgeError)
      expect(e.message).toBe('error getting authenticated signer')
    })
  })
})

describe('BlockchainConnection class should', () => {
  let rsk: BlockchainConnection
  beforeAll(async () => {
    const providerClassMock = jest.mocked(ethers.providers.JsonRpcProvider)
    providerClassMock.mockImplementation(() => providerMock)
    ethers.Wallet.fromEncryptedJson = jest.fn<typeof ethers.Wallet.fromEncryptedJson>()
      .mockResolvedValue({
        connect: () => signerMock
      } as any)

    rsk = await BlockchainConnection.createUsingEncryptedJson('json', 'pass')
  })

  test('be able to return connected address', async () => {
    expect(await rsk.getChainHeight()).toBe(1)
  })
  test('be able to return current block height', async () => {
    expect(await rsk.getConnectedAddress()).toBe('0x9D93929A9099be4355fC2389FbF253982F9dF47c')
  })

  describe('throwErrorIfFailedTx function should', () => {
    test('throw error if transaction failed', () => {
      const result = { txHash: '0x9fafb16acfcc8533a6b249daa01111e381a1d386f7f46fd1932c3cd86b6eb320', successful: false }
      expect(() => { throwErrorIfFailedTx(result) }).toThrow(BridgeError)
    })

    test('don\'t throw error if transaction didn\'t fail', () => {
      const result = { txHash: '0x9fafb16acfcc8533a6b249daa01111e381a1d386f7f46fd1932c3cd86b6eb320', successful: true }
      expect(() => { throwErrorIfFailedTx(result) }).not.toThrow()
    })

    test('use correct error messages', () => {
      const result = { txHash: '0x9fafb16acfcc8533a6b249daa01111e381a1d386f7f46fd1932c3cd86b6eb320', successful: false }
      expect(() => { throwErrorIfFailedTx(result) }).toThrow('error executing transaction')
      expect(() => { throwErrorIfFailedTx(result, 'other error') }).toThrow('other error')
    })
  })

  describe('executeContractFunction function should', () => {
    let contractMock: any
    let receiptMock: { status: number, transactionHash: string }
    beforeAll(() => {
      receiptMock = { status: 1, transactionHash: '0x9fafb16acfcc8533a6b249daa01111e381a1d386f7f46fd1932c3cd86b6eb320' }
      contractMock = {
        contractMethodOk: jest.fn().mockImplementation(async () => {
          return Promise.resolve(
            {
              wait: async () => Promise.resolve(receiptMock)
            }
          )
        }),
        contractMethodFail: jest.fn().mockImplementation(async () => {
          throw new Error('some error')
        })
      }
    })

    test('throw error if transaction failed', async () => {
      expect.assertions(2)
      await executeContractFunction(contractMock, 'contractMethodFail').catch(e => {
        expect(e).toBeInstanceOf(BridgeError)
        expect(e.message).toBe('error executing function contractMethodFail')
      })
    })
    test('execute function with correct parameters', async () => {
      await executeContractFunction(contractMock, 'contractMethodOk', 'test', 5)
      expect(contractMock.contractMethodOk).toBeCalledTimes(1)
      expect(contractMock.contractMethodOk).toBeCalledWith('test', 5)
    })
    test('build result correctly', async () => {
      const result = await executeContractFunction(contractMock, 'contractMethodOk', 'test', 5)
      expect(result.successful).toEqual(true)
      expect(result.txHash).toEqual(receiptMock.transactionHash)
    })
  })

  describe('estimateGas function should', () => {
    let contractMock: any
    beforeAll(() => {
      contractMock = {
        estimateGas: {
          contractMethodOk: jest.fn().mockImplementation(async () => {
            const { BigNumber } = jest.requireActual<typeof ethers>('ethers')
            return Promise.resolve(BigNumber.from(10))
          }),
          contractMethodFail: jest.fn().mockImplementation(async () => {
            throw new Error('some error')
          })
        }
      }
    })

    test('throw error if transaction failed', async () => {
      expect.assertions(2)
      await estimateGas(contractMock, 'contractMethodFail').catch(e => {
        expect(e).toBeInstanceOf(BridgeError)
        expect(e.message).toBe('error estimating gas for function contractMethodFail')
      })
    })

    test('execute function with correct parameters', async () => {
      await estimateGas(contractMock, 'contractMethodOk', 'test', 5)
      expect(contractMock.estimateGas.contractMethodOk).toBeCalledTimes(1)
      expect(contractMock.estimateGas.contractMethodOk).toBeCalledWith('test', 5)
    })

    test('build result correctly', async () => {
      const result = await estimateGas(contractMock, 'contractMethodOk', 'test', 5)
      expect(serializer.stringify(result)).toEqual(serializer.stringify(BigInt(10)))
      expect(typeof result).toBe('bigint')
    })
  })
})
