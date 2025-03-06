import { describe, test, expect } from '@jest/globals'
import { BlockchainConnection } from '@rsksmart/bridges-core-sdk'
import { init } from '@rsksmart/bridges-core-sdk/initialization'
import { setNetworksRpcs } from '@rsksmart/tokenbridge-sdk'
import { readFile } from 'fs/promises'
import { EXTENDED_TIMEOUT } from './common/constants'

describe('Bridges core SDK should', () => {
  test('be able to initialize Flyover SDK', async () => {
    const configBuffer = await readFile('config.json')
    const config: {
      rskRpc: string
      mnemonic: string
    } = JSON.parse(configBuffer.toString())
    const { flyover } = await init({
      network: 'Testnet',
      allowInsecureConnections: true,
      bridges: {
        flyover: {
          captchaTokenResolver: async () => Promise.resolve(''),
          disableChecksum: true
        }
      }
    })

    if (flyover == null) {
      throw new Error('flyover not initialized')
    }

    const rsk = await BlockchainConnection.createUsingPassphrase(config.mnemonic, config.rskRpc)
    await flyover.connectToRsk(rsk)

    const provider = await flyover.getLiquidityProviders().then(providers => providers[1])
    if (provider == null) {
      throw new Error('provider is undefined')
    }
    flyover.useLiquidityProvider(provider)
    await flyover.getQuotes({
      callEoaOrContractAddress: '0xa2193A393aa0c94A4d52893496F02B56C61c36A1',
      callContractArguments: '',
      valueToTransfer: BigInt('6000000000000000'),
      rskRefundAddress: '0xa2193A393aa0c94A4d52893496F02B56C61c36A1'
    })

    await flyover.getPegoutQuotes({
      to: 'n12ja1bZfZhpkxy8KHkQvj6rZM74kbhUWs',
      valueToTransfer: BigInt('6000000000000000'),
      rskRefundAddress: '0xa2193A393aa0c94A4d52893496F02B56C61c36A1'
    })

    const metadata = await flyover.getMetadata()
    const peginMetadata = metadata[0]
    const pegoutMetadata = metadata[1]

    expect(metadata[0]).not.toBeUndefined()

    expect(peginMetadata?.blocksToDeliver).not.toBeUndefined()
    expect(peginMetadata?.maxAmount).not.toBeUndefined()
    expect(peginMetadata?.minAmount).not.toBeUndefined()
    expect(peginMetadata?.operation).not.toBeUndefined()
    expect(peginMetadata?.fees).not.toBeUndefined()
    expect(peginMetadata?.fees.length).toBe(3)

    expect(pegoutMetadata?.blocksToDeliver).not.toBeUndefined()
    expect(pegoutMetadata?.maxAmount).not.toBeUndefined()
    expect(pegoutMetadata?.minAmount).not.toBeUndefined()
    expect(pegoutMetadata?.operation).not.toBeUndefined()
    expect(pegoutMetadata?.fees).not.toBeUndefined()
    expect(pegoutMetadata?.fees.length).toBe(3)
  }, EXTENDED_TIMEOUT)

  test('be able to initialize TokenBridge SDK', async () => {
    const configBuffer = await readFile('config.json')
    const config: {
      rskRpc: string
      otherNetworkRpc: string
      mnemonic: string
    } = JSON.parse(configBuffer.toString())
    const networks = setNetworksRpcs({
      Sepolia: config.otherNetworkRpc,
      RskTestnet: config.rskRpc
    })
    const rsk = await BlockchainConnection.createUsingPassphrase(config.mnemonic, config.rskRpc)
    const { tokenbridge } = await init({
      network: 'Testnet',
      allowInsecureConnections: true,
      rskConnection: rsk,
      bridges: {
        tokenbridge: {
          captchaTokenResolver: async () => Promise.resolve('')
        }
      }
    })

    if (tokenbridge === undefined) {
      throw new Error('tokenbridge not initialized')
    }

    tokenbridge.setCrossingNetworks(networks.RskTestnet, networks.Sepolia)
    const metadata = await tokenbridge.getMetadata()

    expect(metadata.length).toBeGreaterThan(0)
    const operation = metadata.at(0)
    expect(operation?.blocksToDeliver).not.toBeUndefined()
    expect(operation?.maxAmount).not.toBeUndefined()
    expect(operation?.minAmount).not.toBeUndefined()
    expect(operation?.operation).not.toBeUndefined()
    expect(operation?.fees).not.toBeUndefined()
    const fee = operation?.fees.at(0)
    expect(fee?.amount).not.toBeUndefined()
    expect(fee?.decimals).not.toBeUndefined()
    expect(fee?.description).not.toBeUndefined()
    expect(fee?.type).not.toBeUndefined()
    expect(fee?.unit).not.toBeUndefined()
  }, EXTENDED_TIMEOUT)
})
