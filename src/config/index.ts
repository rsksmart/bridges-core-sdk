import { type Connection } from '..'

/** Available network options */
export type Network = 'Mainnet' | 'Testnet' | 'Regtest' | 'Alphanet' | 'Development'

export interface BridgesConfig {
  /** Is the name of the network that the client will be using */
  network: Network
  /**
     * If true http connections will be allowed, otherwise client will throw an error if the connection is not secured
     * @default false
     */
  allowInsecureConnections?: boolean
  /**
     * Is an object that represnts the connection to the RSK network. It may be obtained using {@link BlockchainConnection.createUsingStandard},
     * {@link BlockchainConnection.createUsingEncryptedJson}, {@link BlockchainReadOnlyConnection.createUsingRpc}} or
     * {@link BlockchainConnection.createUsingPassphrase}. This configuration is optional because it is intended to be used on operations
     * that require direct connection to the Liquidity Bridge Contract from SDK, users who are only interested on operations that use
     * Liquidity Provider Server don't have to provide it
     */
  rskConnection?: Connection
}

export * from './flyover'
export * from './tokenbridge'
