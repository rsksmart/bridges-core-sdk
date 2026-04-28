import { bech32, bech32m } from 'bech32'
import { decode as decodeBase58Check } from 'bs58check'
import { utils } from 'ethers'
import { isBtcAddress, isBtcNativeSegwitAddress, isTaprootAddress } from './validation'

export function decodeBtcAddress (address: string, options = { keepChecksum: false }): Uint8Array {
  if (isBtcNativeSegwitAddress(address)) {
    const { words } = bech32.decode(address)
    const witnessVersion = words[0]
    if (witnessVersion === undefined) {
      throw new Error('Missing witness version')
    }
    if (witnessVersion > 0) {
      throw new Error('Addresses with a witness version >= 1 should be encoded in bech32m')
    }
    const witnessProgram = bech32.fromWords(words.slice(1))
    return new Uint8Array([witnessVersion, ...witnessProgram])
  } else if (isTaprootAddress(address)) {
    const { words } = bech32m.decode(address)
    const witnessVersion = words[0]
    if (witnessVersion === undefined) {
      throw new Error('Missing witness version')
    }
    if (witnessVersion === 0) {
      throw new Error('Addresses with witness version 0 should be encoded in bech32')
    }
    const witnessProgram = bech32m.fromWords(words.slice(1))
    return new Uint8Array([witnessVersion, ...witnessProgram])
  } else if (isBtcAddress(address)) {
    return options.keepChecksum ? utils.base58.decode(address) : decodeBase58Check(address)
  } else {
    throw new Error('not a BTC address')
  }
}
