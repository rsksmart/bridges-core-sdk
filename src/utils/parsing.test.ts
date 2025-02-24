import { describe, test, expect, jest, afterEach } from '@jest/globals'
import { decodeBtcAddress } from './parsing'
import { decode as decodeBase58Check } from 'bs58check'
import { bech32, bech32m } from 'bech32'
import { utils } from 'ethers'

jest.mock('bs58check')

describe('decodeBtcAddress function should', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('throw error on invalid address', () => {
    expect(() => decodeBtcAddress('0xa2193A393aa0c94A4d52893496F02B56C61c36A1')).toThrow('not a BTC address')
  })

  test('use bech32m on taproot address', () => {
    const decodeBech32mSpy = jest.spyOn(bech32m, 'decode')
    const decodeBech32Spy = jest.spyOn(bech32, 'decode')
    decodeBtcAddress('bc1p8k4v4xuz55dv49svzjg43qjxq2whur7ync9tm0xgl5t4wjl9ca9snxgmlt')
    decodeBtcAddress('tb1pzqz3rt7rdrqpxemxpzcf8edus3fff5qwq228t5pmh2xsczd4megqp9fk3n')
    decodeBtcAddress('bcrt1p50ugjp9qcw5y59jck6tumgqquts0c2nw6vgdwyks4qpxy3rh0h2qu3s47d')
    expect(decodeBech32mSpy).toHaveBeenCalled()
    expect(decodeBase58Check).not.toHaveBeenCalled()
    expect(decodeBech32Spy).not.toHaveBeenCalled()
  })

  test('use bech32 on native segwit address', () => {
    const decodeBech32mSpy = jest.spyOn(bech32m, 'decode')
    const decodeBech32Spy = jest.spyOn(bech32, 'decode')
    decodeBtcAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')
    decodeBtcAddress('tb1qmsu7ck0tun9qe2wgthu35xcu6asa5aq5tejh02')
    decodeBtcAddress('bcrt1qvvfewm5ujhzz6mt5x07hdd0kmhsy0xmu7vy7eg')
    decodeBtcAddress('bc1qgetrlw67lfylgrqx622qnay23ynxyu5h6q0mks3hs9vh0x32pv5qj4wu7x')
    decodeBtcAddress('tb1q8gy3gz0wzrm8m33j7cjnplfmq8k7sr7yknjjj48q0t2vgqxpu3xs0j67hm')
    decodeBtcAddress('bcrt1qtmm4qallkmnd2vl5y3w3an3uvq6w5v2ahqvfqm0mfxny8cnsdrashv8fsr')
    expect(decodeBech32Spy).toHaveBeenCalled()
    expect(decodeBase58Check).not.toHaveBeenCalled()
    expect(decodeBech32mSpy).not.toHaveBeenCalled()
  })

  test('use base58 on segwit address', () => {
    const decodeBech32Spy = jest.spyOn(bech32, 'decode')
    const decodeBech32mSpy = jest.spyOn(bech32m, 'decode')
    decodeBtcAddress('2N5muMepJizJE1gR7FbHJU6CD18V3BpNF9p')
    decodeBtcAddress('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')
    decodeBtcAddress('2MzQwSSnBHWHqSAqtTVQ6v47XtaisrJa1Vc')
    expect(decodeBech32Spy).not.toHaveBeenCalled()
    expect(decodeBech32mSpy).not.toHaveBeenCalled()
    expect(decodeBase58Check).toHaveBeenCalled()
  })

  test('use base58 on legacy address', () => {
    const decodeBech32Spy = jest.spyOn(bech32, 'decode')
    const decodeBech32mSpy = jest.spyOn(bech32m, 'decode')
    decodeBtcAddress('1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR')
    decodeBtcAddress('mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn')
    expect(decodeBech32Spy).not.toHaveBeenCalled()
    expect(decodeBech32mSpy).not.toHaveBeenCalled()
    expect(decodeBase58Check).toHaveBeenCalled()
  })

  test('be able to keep or remove base58Check checksum', () => {
    const decodeBase58Spy = jest.spyOn(utils.base58, 'decode')
    decodeBtcAddress('1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR')
    expect(decodeBase58Check).toHaveBeenCalled()
    expect(decodeBase58Spy).not.toHaveBeenCalled()
    jest.clearAllMocks()
    decodeBtcAddress('1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR', { keepChecksum: true })
    expect(decodeBase58Check).not.toHaveBeenCalled()
    expect(decodeBase58Spy).toHaveBeenCalled()
    jest.clearAllMocks()
    decodeBtcAddress('1FvzCLoTPGANNjWoUo6jUGuAG3wg1w4YjR', { keepChecksum: false })
    expect(decodeBase58Check).toHaveBeenCalled()
    expect(decodeBase58Spy).not.toHaveBeenCalled()
  })
})
