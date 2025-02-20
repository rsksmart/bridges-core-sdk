import { type Flyover } from '@rsksmart/flyover-sdk'
import { type TokenBridge } from '@rsksmart/tokenbridge-sdk'
import {
  type BlockchainConnection, BridgeError, type BridgesConfig,
  type FlyoverConfig, type Network, type TokenBridgeConfig
} from '@rsksmart/bridges-core-sdk'

export interface BridgesInitParams {
  network: Network
  allowInsecureConnections?: boolean
  rskConnection?: BlockchainConnection
  bridges: Partial<BridgesInitializations>
}

interface AllBridgesConfigs {
  flyover: FlyoverConfig
  tokenbridge: TokenBridgeConfig
}

export interface Bridges {
  flyover: Flyover
  tokenbridge: TokenBridge
}

export type BridgesInitializations = {
  [key in keyof AllBridgesConfigs]: Omit<AllBridgesConfigs[key], keyof BridgesConfig>
}

type BridgeName = keyof AllBridgesConfigs
type SpecificBridgeConfig = AllBridgesConfigs[BridgeName]
type Bridge = Bridges[BridgeName]

async function initBridge (bridgeName: BridgeName, config: SpecificBridgeConfig): Promise<Bridge> {
  switch (bridgeName) {
    case 'flyover': {
      const flyoverPkg = await import('@rsksmart/flyover-sdk')
      return new flyoverPkg.Flyover(config as FlyoverConfig)
    }
    case 'tokenbridge': {
      const tokenbridgePkg = await import('@rsksmart/tokenbridge-sdk')
      return new tokenbridgePkg.TokenBridge(config as TokenBridgeConfig)
    }
    default:
      throw new Error('unexisting bridge')
  }
}

function getConfig (initConfig: BridgesInitParams, bridge: BridgeName): SpecificBridgeConfig {
  const particularConfig = initConfig.bridges[bridge]
  if (particularConfig == null) {
    throw new Error('unexisting bridge')
  }
  const config: SpecificBridgeConfig = {
    ...particularConfig,
    network: initConfig.network,
    allowInsecureConnections: initConfig.allowInsecureConnections,
    rskConnection: initConfig.rskConnection
  }
  return config
}

export async function init (initParams: BridgesInitParams): Promise<Partial<Bridges>> {
  let bridge: Bridge
  const bridges: Partial<Bridges> = {}
  const bridgesNames: BridgeName[] = Object.keys(initParams.bridges) as BridgeName[]
  for (const bridgeName of bridgesNames) {
    try {
      bridge = await initBridge(bridgeName, getConfig(initParams, bridgeName))
      bridges[bridgeName] = bridge as any
    } catch (e) {
      throw convertToBridgeError(bridgeName, e)
    }
  }
  return bridges
}

function convertToBridgeError (bridgeName: BridgeName, e: any): BridgeError {
  if (e?.code !== 'ERR_MODULE_NOT_FOUND') {
    throw e
  }

  const packages: Record<BridgeName, string> = {
    flyover: '@rsksmart/flyover-sdk',
    tokenbridge: '@rsksmart/tokenbridge-sdk'
  }

  return new BridgeError({
    timestamp: Date.now(),
    recoverable: false,
    message: 'Missing bridge package',
    details: `You're trying to use a bridge which is not in your package, please install ${packages[bridgeName]} to start using ${bridgeName}`,
    product: 'core'
  })
}
