import { utils } from 'ethers'
import { type Network } from '../config'

const RSK_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

// P2TR
const BTC_MAINNET_P2TR_ADDRESS_REGEX = /^bc1p([ac-hj-np-z02-9]{58})$/
const BTC_TESTNET_P2TR_ADDRESS_REGEX = /^tb1p([ac-hj-np-z02-9]{58})$/
const BTC_REGTEST_P2TR_ADDRESS_REGEX = /^bcrt1p([ac-hj-np-z02-9]{58})$/

// P2WSH
const BTC_MAINNET_P2WSH_ADDRESS_REGEX = /^bc1q([ac-hj-np-z02-9]{58})$/
const BTC_TESTNET_P2WSH_ADDRESS_REGEX = /^tb1q([ac-hj-np-z02-9]{58})$/
const BTC_REGTEST_P2WSH_ADDRESS_REGEX = /^bcrt1q([ac-hj-np-z02-9]{58})$/

// P2WPKH
const BTC_MAINNET_P2WPKH_ADDRESS_REGEX = /^bc1q([ac-hj-np-z02-9]{38})$/
const BTC_TESTNET_P2WPKH_ADDRESS_REGEX = /^tb1q([ac-hj-np-z02-9]{38})$/
const BTC_REGTEST_P2WPKH_ADDRESS_REGEX = /^bcrt1q([ac-hj-np-z02-9]{38})$/

// P2SH
const BTC_MAINNET_P2SH_ADDRESS_REGEX = /^[3]([a-km-zA-HJ-NP-Z1-9]{33,34})$/
const BTC_TESTNET_P2SH_ADDRESS_REGEX = /^[2]([a-km-zA-HJ-NP-Z1-9]{33,34})$/

// P2PKH (LEGACY)
const BTC_MAINNET_P2PKH_ADDRESS_REGEX = /^[1]([a-km-zA-HJ-NP-Z1-9]{25,34})$/
const BTC_TESTNET_P2PKH_ADDRESS_REGEX = /^[mn]([a-km-zA-HJ-NP-Z1-9]{25,34})$/

// Bitcoin zero address as bytes
export const BTC_ZERO_ADDRESS_MAINNET = '1111111111111111111114oLvT2'
export const BTC_ZERO_ADDRESS_TESTNET = 'mfWxJ45yp2SFn7UciZyNpvDKrzbhyfKrY8'

export function validateRequiredFields (objectToValidate: object, ...requiredFields: string[]): void {
  const propertiesWithValue = Object.entries(objectToValidate)
    .filter(entry => entry[1] !== null && entry[1] !== undefined)
    .map(entry => entry[0])

  const missingProperties = requiredFields.filter(prop => !propertiesWithValue.includes(prop))
  if (missingProperties.length !== 0) {
    throw new Error('Validation failed for object with following missing properties: ' + missingProperties.join(', '))
  }
}

export function isSecureUrl (urlString: string): boolean {
  const url = new URL(urlString)
  return url.protocol === 'https:'
}

export function isBtcAddress (address: string): boolean {
  return [
    BTC_MAINNET_P2WSH_ADDRESS_REGEX,
    BTC_TESTNET_P2WSH_ADDRESS_REGEX,
    BTC_REGTEST_P2WSH_ADDRESS_REGEX,
    BTC_MAINNET_P2WPKH_ADDRESS_REGEX,
    BTC_TESTNET_P2WPKH_ADDRESS_REGEX,
    BTC_REGTEST_P2WPKH_ADDRESS_REGEX,
    BTC_MAINNET_P2SH_ADDRESS_REGEX,
    BTC_TESTNET_P2SH_ADDRESS_REGEX,
    BTC_MAINNET_P2PKH_ADDRESS_REGEX,
    BTC_TESTNET_P2PKH_ADDRESS_REGEX,
    BTC_MAINNET_P2TR_ADDRESS_REGEX,
    BTC_TESTNET_P2TR_ADDRESS_REGEX,
    BTC_REGTEST_P2TR_ADDRESS_REGEX
  ].some(regex => regex.test(address))
}

export function isBtcNativeSegwitAddress (address: string): boolean {
  const isNotMixedCase = address === address.toLowerCase() || address === address.toUpperCase()
  return [
    BTC_MAINNET_P2WSH_ADDRESS_REGEX,
    BTC_TESTNET_P2WSH_ADDRESS_REGEX,
    BTC_REGTEST_P2WSH_ADDRESS_REGEX,
    BTC_MAINNET_P2WPKH_ADDRESS_REGEX,
    BTC_TESTNET_P2WPKH_ADDRESS_REGEX,
    BTC_REGTEST_P2WPKH_ADDRESS_REGEX
  ].some(regex => regex.test(address)) && isNotMixedCase
}

export function isTaprootAddress (address: string): boolean {
  return [
    BTC_MAINNET_P2TR_ADDRESS_REGEX,
    BTC_TESTNET_P2TR_ADDRESS_REGEX,
    BTC_REGTEST_P2TR_ADDRESS_REGEX
  ].some(regex => regex.test(address))
}

export function isBtcTestnetAddress (address: string): boolean {
  return [
    BTC_TESTNET_P2WSH_ADDRESS_REGEX,
    BTC_TESTNET_P2WPKH_ADDRESS_REGEX,
    BTC_TESTNET_P2SH_ADDRESS_REGEX,
    BTC_TESTNET_P2PKH_ADDRESS_REGEX,
    BTC_TESTNET_P2TR_ADDRESS_REGEX,
    BTC_REGTEST_P2TR_ADDRESS_REGEX,
    BTC_REGTEST_P2WSH_ADDRESS_REGEX,
    BTC_REGTEST_P2WPKH_ADDRESS_REGEX
  ].some(regex => regex.test(address))
}

export function isBtcMainnetAddress (address: string): boolean {
  return [
    BTC_MAINNET_P2WSH_ADDRESS_REGEX,
    BTC_MAINNET_P2WPKH_ADDRESS_REGEX,
    BTC_MAINNET_P2SH_ADDRESS_REGEX,
    BTC_MAINNET_P2PKH_ADDRESS_REGEX,
    BTC_MAINNET_P2TR_ADDRESS_REGEX
  ].some(regex => regex.test(address))
}

export function isLegacyBtcAddress (address: string): boolean {
  return [
    BTC_MAINNET_P2PKH_ADDRESS_REGEX,
    BTC_TESTNET_P2PKH_ADDRESS_REGEX,
    BTC_MAINNET_P2SH_ADDRESS_REGEX,
    BTC_TESTNET_P2SH_ADDRESS_REGEX
  ].some(regex => regex.test(address))
}

export function isRskAddress (address: string): boolean {
  return RSK_ADDRESS_REGEX.test(address)
}

export function isValidSignature (address: string, message: string, signature: string, isHexMessage = true): boolean {
  message = isHexMessage && !message.startsWith('0x') ? '0x' + message : message
  const parsedMessage = isHexMessage ? utils.arrayify(message) : utils.hashMessage(message)
  signature = signature.startsWith('0x') ? signature : '0x' + signature
  try {
    const recoveredAddress = utils.recoverAddress(parsedMessage, signature)
    return address.toLowerCase() === recoveredAddress.toLowerCase()
  } catch (e) {
    return false
  }
}

export function assertTruthy<T> (
  value: T | undefined | null,
  message = 'unexpected falsy value'
): asserts value is T {
  if (value === undefined || value === null || value === '' || value === false || value === 0 || (typeof value === 'number' && isNaN(value))) {
    throw new Error(message)
  }
}

export function rskChecksum (address: string, chainId: 30 | 31 | 33): string {
  if (!RSK_ADDRESS_REGEX.test(address)) {
    throw new Error('Invalid RSK address')
  }

  const lowerCaseAddress = address.toLowerCase()
  const hashInput = chainId.toString() + lowerCaseAddress
  const hash = utils.keccak256(utils.toUtf8Bytes(hashInput))

  return lowerCaseAddress.split('')
    .map((character, i) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return parseInt(hash.at(i)!, 16) >= 8 ? character.toUpperCase() : character
    })
    .join('')
}

export function isRskChecksummedAddress (address: string, chainId: 30 | 31 | 33): boolean {
  return rskChecksum(address, chainId) === address
}

export function isBtcZeroAddress (config: { network: Network }, address: string): boolean {
  if (config.network === 'Mainnet') {
    return address === BTC_ZERO_ADDRESS_MAINNET
  }

  return address === BTC_ZERO_ADDRESS_TESTNET
}
