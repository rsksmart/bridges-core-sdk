/**
   * Filter the bridges that can perform a specific conversion
   *
   * @param { string } fromToken origin token
   * @param { string } toToken destination token
   * @param { Bridge[] } bridges array of initialized bridges to validate
   *
   * @returns { Bridge[] } the bridges that are capable of convertin fromToken to toToken
   */
export function getProperBridges (fromToken: string, toToken: string, bridges: Bridge[]): Bridge[] {
  return bridges.filter(bridge => bridge.supportsConversion(fromToken, toToken))
}

/** Interface that represents a fee to be paid in the service. This fee is included in the total price */
export interface Fee {
  amount: bigint | number
  decimals: number
  type: 'Fixed' | 'Percental' // TODO fix typo
  description: string
  unit?: string
}

export type Confirmations = Map<bigint, number>

/** Interface that represents the specification of an operation with a given bridge */
export interface BridgeMetadata {
  operation: string
  maxAmount: bigint
  minAmount: bigint
  blocksToDeliver: Confirmations | number
  fees: Fee[]
}

/** Interface with common operations to know the capabilities of every bridge product */
export interface Bridge {
  /**
     * Check if the implementing bridge supports a specific token conversion
     *
     * @param { string } fromToken origin token
     * @param { string } toToken destination token
     *
     * @returns { boolean } if the bridge supports the convertion or not
     */
  supportsConversion: (fromToken: string, toToken: string) => boolean
  /**
     * Get information about the conditions of the bridge services
     *
     * @returns { BridgeMetadata[] } specification of every possible operation
     */
  getMetadata: () => Promise<BridgeMetadata[]>
  /**
     * Check if the implementing bridge supports a specific network
     *
     * @param { number } chainId the chain ID
     *
     * @returns { boolean } if the bridge supports the network or not
     */
  supportsNetwork: (chainId: number) => boolean
}
