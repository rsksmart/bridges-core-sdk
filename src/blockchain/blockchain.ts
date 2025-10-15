import { providers, Wallet, type Signer, type Contract, type ContractReceipt } from 'ethers'
import { BridgeError } from '../client/httpClient'

const DEFAULT_NODE_URL = 'https://public-node.testnet.rsk.co'

export interface TxResult {
  txHash: string
  successful: boolean
}

function connectionError (e: Error): BridgeError {
  return new BridgeError({
    timestamp: Date.now(),
    recoverable: true,
    message: 'error getting authenticated signer',
    details: {
      error: e.message
    }
  })
}

/** Generalization for the classes that represent a connection to the blockchain */
export interface Connection {
  /**
   * Returns current chain height if the connection is working
   *
   * @returns { numner|undefined } current block number
   */
  getChainHeight: () => Promise<number | undefined>
  /**
   * Get the chain ID of the network that this connection was made for
   *
   * @returns { number } the chain ID
   */
  getChainId: () => Promise<number>
  /**
   * Get the ethers connection object used as abstraction for the connection
   *
   * @returns { Signer | providers.Provider } ethers abstraction
   */
  getAbstraction: () => Signer | providers.Provider
  /**
   * Get the receipt for a specific transaction
   *
   * @param { string } tx the transaction hash
   *
   * @returns { Promise<ContractReceipt | null> } promise with the receipt or null
   */
  getTransactionReceipt: (tx: string) => Promise<ContractReceipt | null>
  /**
   * Get the underlying provider object used by the connection. Useful for some operations that require
   * the provider object and don't require wrapping because they are not complex enough.
   *
   * @returns { providers.Provider | undefined } the provider object or undefined if it doesn't exist
   */
  getUnderlyingProvider: () => providers.Provider | undefined
}

/**
 * Class that represents a connection to the blockchain, this allows to interact with
 * some smart contract functions that the SDK requires
 */
export class BlockchainConnection implements Connection {
  private constructor (
    private readonly _signer: Signer
  ) {}

  /**
   * Creates the connection object using a EIP-1193 standard. This allows SDK compatibility with wallets
   * like Metamask or any other wallet that injects the window.ethereum object in browser. This method
   * uses ethers.providers.Web3Provider internally to generate the connection.
   *
   * @param { Eip1193Provider } standard EIP-1193 standard object, e.g., window.ethereum
   *
   * @returns { BlockchainConnection } Connection object
   *
   * @throws { FlyoverError } On faliled connection
   */
  static async createUsingStandard (standard: providers.ExternalProvider): Promise<BlockchainConnection> {
    try {
      const signer: Signer = new providers.Web3Provider(standard).getSigner()
      return new BlockchainConnection(signer)
    } catch (e) {
      throw connectionError(e as Error)
    }
  }

  /**
   * Creates connection object using encrypted json and its password. This method allows
   * SDK usage from server side. This method uses ethers.providers.JsonRpcProvider internally to
   * generate the connection.
   *
   * @param { any } json encrypted json
   * @param { string } password encrypted json encryption password
   * @param { string } url node url, by default it is RSK testnet public node
   *
   * @returns { BlockchainConnection } Connection object
   *
   * @throws { FlyoverError } On faliled connection
   */
  static async createUsingEncryptedJson (json: any, password: string, url: string = DEFAULT_NODE_URL): Promise<BlockchainConnection> {
    try {
      const signer = await Wallet.fromEncryptedJson(JSON.stringify(json), password)
      const provider = new providers.JsonRpcProvider(url)
      await provider.getNetwork()
      const connectedSigner = signer.connect(provider)
      return new BlockchainConnection(connectedSigner)
    } catch (e) {
      throw connectionError(e as Error)
    }
  }

  /**
   * Creates connection object using a passphrase. This method allows SDK usage
   * from server side. This method uses ethers.providers.JsonRpcProvider internally to
   * generate the connection.
   *
   * @param { string } passphrase account passphrase
   * @param { string } url node url, by default it is RSK testnet public node
   *
   * @returns { BlockchainConnection } Connection object
   *
   * @throws { FlyoverError } On faliled connection
   */
  static async createUsingPassphrase (passphrase: string, url: string = DEFAULT_NODE_URL): Promise<BlockchainConnection> {
    try {
      const signer = Wallet.fromMnemonic(passphrase)
      const provider = new providers.JsonRpcProvider(url)
      await provider.getNetwork()
      const connectedSigner = signer.connect(provider)
      return new BlockchainConnection(connectedSigner)
    } catch (e) {
      throw connectionError(e as Error)
    }
  }

  /**
   * Returns authenticated signer address
   *
   * @returns { string } signer address
   */
  async getConnectedAddress (): Promise<string> {
    return this.signer.getAddress()
  }

  async getChainHeight (): Promise<number | undefined> {
    return this.signer.provider?.getBlockNumber()
  }

  /**
   * Getter for ethers.Signer used object. This object represents a read/write connection to the blockchain
   *
   * @returns { Signer } signer
   */
  get signer (): Signer {
    return this._signer
  }

  async getChainId (): Promise<number> {
    return this._signer.getChainId()
  }

  getAbstraction (): Signer | providers.Provider {
    return this._signer
  }

  async getTransactionReceipt (tx: string): Promise<ContractReceipt | null> {
    return this._signer.provider?.getTransactionReceipt(tx) ?? Promise.resolve(null)
  }

  async executeTransaction (args: { to: string, data: string, value: string }): Promise<TxResult> {
    const { to, data, value } = args
    const gasLimit = await this._signer.estimateGas({ to, data, value })
    const tx = await this._signer.sendTransaction({ to, data, value, gasLimit })
    const receipt = await tx.wait()
    return { txHash: receipt.transactionHash, successful: Boolean(receipt.status) }
  }

  getUnderlyingProvider (): providers.Provider | undefined {
    return this.signer.provider
  }
}

/**
 * Class that represents a readonly connection to the blockchain, this allows to interact with
 * some smart contract views that the SDK requires. All the state-changing functions executed
 * with this class should throw an error
 */
export class BlockchainReadOnlyConnection implements Connection {
  public constructor (
    private readonly _provider: providers.Provider
  ) {}

  /**
   * Creates the connection object using a RPC server, it uses  ethers.providers.JsonRpcProvider
   * internally to create the connection
   *
   * @param { string } rpcUrl the url of the JSON RPC server
   *
   * @returns { BlockchainReadOnlyConnection } Connection object
   *
   * @throws { BridgeError } On failed connection
   */
  static async createUsingRpc (rpcUrl: string): Promise<BlockchainReadOnlyConnection> {
    const provider = new providers.JsonRpcProvider(rpcUrl)
    return new BlockchainReadOnlyConnection(provider)
  }

  async getChainHeight (): Promise<number | undefined> {
    return this._provider.getBlockNumber()
  }

  async getChainId (): Promise<number> {
    return this._provider.getNetwork().then(n => n.chainId)
  }

  getAbstraction (): Signer | providers.Provider {
    return this._provider
  }

  async getTransactionReceipt (tx: string): Promise<ContractReceipt> {
    return this._provider.getTransactionReceipt(tx)
  }

  getUnderlyingProvider (): providers.Provider {
    return this._provider
  }
}

export function throwErrorIfFailedTx (txResult: TxResult, message: string = 'error executing transaction'): void {
  if (!txResult.successful) {
    throw new BridgeError({
      timestamp: Date.now(),
      recoverable: true,
      message,
      details: {
        txHash: txResult.txHash
      }
    })
  }
}

export async function executeContractFunction (contract: Contract, functionName: string, ...params: unknown[]): Promise<TxResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tx = await contract[functionName]!(...params)
    const receipt = await tx.wait()
    return { txHash: receipt.transactionHash, successful: Boolean(receipt.status) }
  } catch (e: any) {
    throw new BridgeError({
      timestamp: Date.now(),
      recoverable: true,
      message: `error executing function ${functionName}`,
      details: {
        error: e.message
      }
    })
  }
}

export async function executeContractView<T> (contract: Contract, functionName: string, ...params: unknown[]): Promise<T> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await contract[functionName]!(...params)
    return result
  } catch (e: any) {
    throw new BridgeError({
      timestamp: Date.now(),
      recoverable: true,
      message: `error executing view ${functionName}`,
      details: {
        error: e.message
      }
    })
  }
}

export async function estimateGas (contract: Contract, functionName: string, ...params: unknown[]): Promise<bigint> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const value = await contract.estimateGas[functionName]!(...params)
    return value.toBigInt()
  } catch (e: any) {
    throw new BridgeError({
      timestamp: Date.now(),
      recoverable: true,
      message: `error estimating gas for function ${functionName}`,
      details: {
        error: e.message
      }
    })
  }
}

export async function callContractFunction<R> (contract: Contract, functionName: string, ...params: unknown[]): Promise<R> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = await contract.callStatic[functionName]!(...params)
    return result
  } catch (e: any) {
    throw new BridgeError({
      timestamp: Date.now(),
      recoverable: true,
      message: `error during static call to function ${functionName}`,
      details: {
        error: e
      }
    })
  }
}
