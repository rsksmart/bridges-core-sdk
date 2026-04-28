import { describe, test, expect, jest, afterEach } from '@jest/globals'
import { decodeBtcAddress } from './parsing'
import { bech32, bech32m } from 'bech32'
import { utils } from 'ethers'
import bs58check from 'bs58check'

describe('decodeBtcAddress function should', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('use correct decoder for address type', () => {
    test('throw error on invalid address', () => {
      expect(() => decodeBtcAddress('0xa2193A393aa0c94A4d52893496F02B56C61c36A1')).toThrow('not a BTC address')
    })

    test('use bech32m on taproot address', () => {
      const decodeBech32mSpy = jest.spyOn(bech32m, 'decode')
      const decodeBech32Spy = jest.spyOn(bech32, 'decode')
      const decodeBs56Check = jest.spyOn(bs58check, 'decode')
      decodeBtcAddress('bc1p8k4v4xuz55dv49svzjg43qjxq2whur7ync9tm0xgl5t4wjl9ca9snxgmlt')
      decodeBtcAddress('tb1pzqz3rt7rdrqpxemxpzcf8edus3fff5qwq228t5pmh2xsczd4megqp9fk3n')
      decodeBtcAddress('bcrt1p50ugjp9qcw5y59jck6tumgqquts0c2nw6vgdwyks4qpxy3rh0h2qu3s47d')
      expect(decodeBech32mSpy).toHaveBeenCalled()
      expect(decodeBs56Check).not.toHaveBeenCalled()
      expect(decodeBech32Spy).not.toHaveBeenCalled()
    })

    test('use bech32 on native segwit address', () => {
      const decodeBech32mSpy = jest.spyOn(bech32m, 'decode')
      const decodeBech32Spy = jest.spyOn(bech32, 'decode')
      const decodeBs56Check = jest.spyOn(bs58check, 'decode')
      decodeBtcAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')
      decodeBtcAddress('tb1qmsu7ck0tun9qe2wgthu35xcu6asa5aq5tejh02')
      decodeBtcAddress('bcrt1qvvfewm5ujhzz6mt5x07hdd0kmhsy0xmu7vy7eg')
      decodeBtcAddress('bc1qgetrlw67lfylgrqx622qnay23ynxyu5h6q0mks3hs9vh0x32pv5qj4wu7x')
      decodeBtcAddress('tb1q8gy3gz0wzrm8m33j7cjnplfmq8k7sr7yknjjj48q0t2vgqxpu3xs0j67hm')
      decodeBtcAddress('bcrt1qtmm4qallkmnd2vl5y3w3an3uvq6w5v2ahqvfqm0mfxny8cnsdrashv8fsr')
      expect(decodeBech32Spy).toHaveBeenCalled()
      expect(decodeBs56Check).not.toHaveBeenCalled()
      expect(decodeBech32mSpy).not.toHaveBeenCalled()
    })

    test('use base58 on segwit address', () => {
      const decodeBech32Spy = jest.spyOn(bech32, 'decode')
      const decodeBech32mSpy = jest.spyOn(bech32m, 'decode')
      const decodeBs56Check = jest.spyOn(bs58check, 'decode')
      decodeBtcAddress('2N5muMepJizJE1gR7FbHJU6CD18V3BpNF9p')
      decodeBtcAddress('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')
      decodeBtcAddress('2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc')
      expect(decodeBech32Spy).not.toHaveBeenCalled()
      expect(decodeBech32mSpy).not.toHaveBeenCalled()
      expect(decodeBs56Check).toHaveBeenCalled()
    })

    test('use base58 on legacy address', () => {
      const decodeBech32Spy = jest.spyOn(bech32, 'decode')
      const decodeBech32mSpy = jest.spyOn(bech32m, 'decode')
      const decodeBs56Check = jest.spyOn(bs58check, 'decode')
      decodeBtcAddress('1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR')
      decodeBtcAddress('mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn')
      expect(decodeBech32Spy).not.toHaveBeenCalled()
      expect(decodeBech32mSpy).not.toHaveBeenCalled()
      expect(decodeBs56Check).toHaveBeenCalled()
    })

    test('be able to keep or remove base58Check checksum', () => {
      const decodeBase58Spy = jest.spyOn(utils.base58, 'decode')
      const decodeBs56Check = jest.spyOn(bs58check, 'decode')
      decodeBtcAddress('1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR')
      expect(decodeBs56Check).toHaveBeenCalled()
      expect(decodeBase58Spy).not.toHaveBeenCalled()
      jest.clearAllMocks()
      decodeBtcAddress('1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR', { keepChecksum: true })
      expect(decodeBs56Check).not.toHaveBeenCalled()
      expect(decodeBase58Spy).toHaveBeenCalled()
      jest.clearAllMocks()
      decodeBtcAddress('1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR', { keepChecksum: false })
      expect(decodeBs56Check).toHaveBeenCalled()
      expect(decodeBase58Spy).not.toHaveBeenCalled()
    })
  })

  describe('decode native segwit addresses', () => {
    // P2WPKH: witness version 0 + 20-byte hash = 21 bytes expected
    const P2WPKH_EXPECTED_BYTE_LENGTH = 21
    // P2WSH: witness version 0 + 32-byte hash = 33 bytes expected
    const P2WSH_EXPECTED_BYTE_LENGTH = 33
    test('decode mainnet P2WPKH address (bc1q)', () => {
      const address = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2WPKH_EXPECTED_BYTE_LENGTH)
    })
    test('decode testnet P2WPKH address (tb1q)', () => {
      const address = 'tb1qmsu7ck0tun9qe2wgthu35xcu6asa5aq5tejh02'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2WPKH_EXPECTED_BYTE_LENGTH)
    })
    test('decode regtest P2WPKH address (bcrt1q)', () => {
      const address = 'bcrt1qvvfewm5ujhzz6mt5x07hdd0kmhsy0xmu7vy7eg'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2WPKH_EXPECTED_BYTE_LENGTH)
    })
    test('decode mainnet P2WSH address (bc1q - 62 chars)', () => {
      const address = 'bc1qgetrlw67lfylgrqx622qnay23ynxyu5h6q0mks3hs9vh0x32pv5qj4wu7x'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2WSH_EXPECTED_BYTE_LENGTH)
    })
    test('decode testnet P2WSH address (tb1q - 62 chars)', () => {
      const address = 'tb1q8gy3gz0wzrm8m33j7cjnplfmq8k7sr7yknjjj48q0t2vgqxpu3xs0j67hm'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2WSH_EXPECTED_BYTE_LENGTH)
    })
    test('decode regtest P2WSH address (bcrt1q - 62 chars)', () => {
      const address = 'bcrt1qtmm4qallkmnd2vl5y3w3an3uvq6w5v2ahqvfqm0mfxny8cnsdrashv8fsr'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2WSH_EXPECTED_BYTE_LENGTH)
    })
  })

  describe('decode taproot addresses', () => {
    // Taproot: witness version 1 + 32-byte pubkey = 33 bytes expected
    const TAPROOT_EXPECTED_BYTE_LENGTH = 33
    test('decode mainnet taproot address (bc1p)', () => {
      const address = 'bc1p8k4v4xuz55dv49svzjg43qjxq2whur7ync9tm0xgl5t4wjl9ca9snxgmlt'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(TAPROOT_EXPECTED_BYTE_LENGTH)
    })
    test('decode testnet taproot address (tb1p)', () => {
      const address = 'tb1pzqz3rt7rdrqpxemxpzcf8edus3fff5qwq228t5pmh2xsczd4megqp9fk3n'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(TAPROOT_EXPECTED_BYTE_LENGTH)
    })
    test('decode regtest taproot address (bcrt1p)', () => {
      const address = 'bcrt1p50ugjp9qcw5y59jck6tumgqquts0c2nw6vgdwyks4qpxy3rh0h2qu3s47d'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(TAPROOT_EXPECTED_BYTE_LENGTH)
    })
    test('first byte should be witness version 1 for taproot', () => {
      const address = 'bc1p8k4v4xuz55dv49svzjg43qjxq2whur7ync9tm0xgl5t4wjl9ca9snxgmlt'
      const decoded = decodeBtcAddress(address)
      expect(decoded[0]).toBe(1)
    })
  })

  describe('decode P2SH addresses', () => {
    /**
   * P2SH addresses use base58check encoding.
   * Version bytes: 0x05 (mainnet), 0xc4 (testnet)
   * Decoded: version (1 byte) + script hash (20 bytes) = 21 bytes
   */
    const P2SH_DECODED_LENGTH = 21 // 1 byte version + 20 bytes hash

    test('decode testnet P2SH address (2N)', () => {
      const address = '2N5muMepJizJE1gR7FbHJU6CD18V3BpNF9p'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2SH_DECODED_LENGTH)
      // Testnet P2SH version byte is 0xc4 (196)
      expect(decoded[0]).toBe(0xc4)
    })

    test('decode testnet P2SH address (2M)', () => {
      const address = '2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2SH_DECODED_LENGTH)
      expect(decoded[0]).toBe(0xc4)
    })

    test('decode mainnet P2SH address (3)', () => {
      const address = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2SH_DECODED_LENGTH)
      // Mainnet P2SH version byte is 0x05 (5)
      expect(decoded[0]).toBe(0x05)
    })
  })

  describe('decode legacy P2PKH addresses', () => {
    /**
   * P2PKH (legacy) addresses use base58check encoding.
   * Version bytes: 0x00 (mainnet), 0x6f (testnet)
   * Decoded: version (1 byte) + pubkey hash (20 bytes) = 21 bytes
   */
    const P2PKH_DECODED_LENGTH = 21 // 1 byte version + 20 bytes pubkey hash

    test('decode mainnet P2PKH address (1)', () => {
      const address = '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2PKH_DECODED_LENGTH)
      // Mainnet P2PKH version byte is 0x00 (0)
      expect(decoded[0]).toBe(0x00)
    })

    test('decode testnet P2PKH address (m/n)', () => {
      const address = 'mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(P2PKH_DECODED_LENGTH)
      // Testnet P2PKH version byte is 0x6f (111)
      expect(decoded[0]).toBe(0x6f)
    })

    test('verify known P2PKH address decodes to expected hash', () => {
      // Address 1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR
      // Known hash160: a3c78d275195f05766a9b497d7838b27bacac775
      const address = '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR'
      const decoded = decodeBtcAddress(address)
      const expectedHash = new Uint8Array([
        0xa3, 0xc7, 0x8d, 0x27, 0x51, 0x95, 0xf0, 0x57,
        0x66, 0xa9, 0xb4, 0x97, 0xd7, 0x83, 0x8b, 0x27,
        0xba, 0xca, 0xc7, 0x75
      ])
      // Skip version byte, compare hash160
      expect(Array.from(decoded.slice(1))).toEqual(Array.from(expectedHash))
    })
  })

  describe('witness version verification', () => {
    test('first byte should be witness version 0 for native segwit', () => {
      const p2wpkh = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
      const p2wsh = 'bc1qgetrlw67lfylgrqx622qnay23ynxyu5h6q0mks3hs9vh0x32pv5qj4wu7x'
      expect(decodeBtcAddress(p2wpkh)[0]).toBe(0)
      expect(decodeBtcAddress(p2wsh)[0]).toBe(0)
    })
  })

  describe('handle keepChecksum option for base58 addresses', () => {
    test('decode without checksum by default', () => {
      const address = '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR'
      const decoded = decodeBtcAddress(address)
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(21) // Without 4-byte checksum
    })

    test('decode with checksum when keepChecksum is true', () => {
      const address = '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR'
      const decoded = decodeBtcAddress(address, { keepChecksum: true })
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(25) // With 4-byte checksum (21 + 4)
    })

    test('decode without checksum when keepChecksum is false', () => {
      const address = '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR'
      const decoded = decodeBtcAddress(address, { keepChecksum: false })
      expect(decoded).toBeInstanceOf(Uint8Array)
      expect(decoded.length).toBe(21)
    })

    test('checksum bytes are correct', () => {
      const address = '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR'
      const withChecksum = decodeBtcAddress(address, { keepChecksum: true })
      const withoutChecksum = decodeBtcAddress(address, { keepChecksum: false })
      // First 21 bytes should be identical
      expect(Array.from(withChecksum.slice(0, 21))).toEqual(Array.from(withoutChecksum))
      // Last 4 bytes are the checksum
      expect(withChecksum.length - withoutChecksum.length).toBe(4)
    })
  })

  describe('handle invalid addresses', () => {
    test('throw error for empty string', () => {
      expect(() => decodeBtcAddress('')).toThrow()
    })

    test('throw error for random string', () => {
      expect(() => decodeBtcAddress('notavalidaddress')).toThrow()
    })

    test('throw error for invalid bech32 checksum', () => {
      // Modified last character to break checksum
      expect(() => decodeBtcAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdx')).toThrow()
    })

    test('throw error for invalid base58 checksum', () => {
      // Modified last character to break checksum
      expect(() => decodeBtcAddress('1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjX')).toThrow()
    })
  })

  describe('produce consistent results', () => {
    test('same address produces same decoded output', () => {
      const address = '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR'
      const decoded1 = decodeBtcAddress(address)
      const decoded2 = decodeBtcAddress(address)
      expect(decoded1).toEqual(decoded2)
    })

    test('different addresses produce different decoded outputs', () => {
      const address1 = '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR'
      const address2 = '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy'
      const decoded1 = decodeBtcAddress(address1)
      const decoded2 = decodeBtcAddress(address2)
      expect(decoded1).not.toEqual(decoded2)
    })

    test('same segwit address decoded multiple times produces identical results', () => {
      const address = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
      const results = Array.from({ length: 5 }, () => decodeBtcAddress(address))
      results.forEach(result => {
        expect(result).toEqual(results[0])
      })
    })
  })

  describe('output format consistency', () => {
    test('all address types should return Uint8Array', () => {
      const addresses = [
        'bc1p8k4v4xuz55dv49svzjg43qjxq2whur7ync9tm0xgl5t4wjl9ca9snxgmlt', // taproot
        'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', // P2WPKH
        'bc1qgetrlw67lfylgrqx622qnay23ynxyu5h6q0mks3hs9vh0x32pv5qj4wu7x', // P2WSH
        '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy', // P2SH
        '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR' // P2PKH
      ]
      addresses.forEach(address => {
        const decoded = decodeBtcAddress(address)
        expect(decoded).toBeInstanceOf(Uint8Array)
      })
    })

    test('all decoded values should be valid 8-bit bytes (0-255)', () => {
      const addresses = [
        'bc1p8k4v4xuz55dv49svzjg43qjxq2whur7ync9tm0xgl5t4wjl9ca9snxgmlt',
        'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
        '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
        '1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR'
      ]
      addresses.forEach(address => {
        const decoded = decodeBtcAddress(address)
        decoded.forEach(byte => {
          // If returning proper 8-bit bytes, all values should be 0-255
          // If returning 5-bit words, values will be 0-31
          // This test expects proper 8-bit bytes
          expect(byte).toBeGreaterThanOrEqual(0)
          expect(byte).toBeLessThanOrEqual(255)
        })
      })
    })

    test('bech32 decoded values should contain bytes > 31 (proving 8-bit conversion)', () => {
      // If properly converted from 5-bit to 8-bit, the hash bytes
      // should contain values > 31 (max 5-bit value)
      const address = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
      const decoded = decodeBtcAddress(address)
      // Skip witness version byte, check the hash
      const hashBytes = Array.from(decoded.slice(1))
      const hasLargeValues = hashBytes.some(byte => byte > 31)
      // If this fails, the function is returning raw 5-bit words
      // instead of converting to 8-bit bytes
      expect(hasLargeValues).toBe(true)
    })
  })
})
