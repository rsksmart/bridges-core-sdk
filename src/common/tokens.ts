import { deepFreeze } from '../utils'

export const tokens = deepFreeze({
  BTC: 'BTC',
  rBTC: 'rBTC'
} as const)
