import { describe, test, expect } from '@jest/globals'
import { tryDecodeBtcAddress } from './parsing'

describe('tryDecodeBtcAddress function should', () => {
  test('return the decoded bytes for a valid address', () => {
    expect(tryDecodeBtcAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')).not.toBeNull()
  })

  test('return null for an address it cannot decode', () => {
    expect(tryDecodeBtcAddress('0xa2193A393aa0c94A4d52893496F02B56C61c36A1')).toBeNull()
  })
})
