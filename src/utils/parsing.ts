import { bech32, bech32m } from 'bech32'
import { decode as decodeBase58Check } from 'bs58check'
import { utils } from 'ethers'
import { isBtcAddress, isBtcNativeSegwitAddress, isTaprootAddress } from './validation'

export function decodeBtcAddress (address: string, options = { keepChecksum: false }): Uint8Array {
  if (isBtcNativeSegwitAddress(address)) {
    return new Uint8Array(bech32.decode(address).words)
  } else if (isTaprootAddress(address)) {
    return new Uint8Array(bech32m.decode(address).words)
  } else if (isBtcAddress(address)) {
    return options.keepChecksum ? utils.base58.decode(address) : decodeBase58Check(address)
  } else {
    throw new Error('not a BTC address')
  }
}
