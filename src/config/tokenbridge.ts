import type { BridgesConfig } from '.'
import type { CaptchaTokenResolver } from '..'

export interface TokenBridgeConfig extends BridgesConfig {
  captchaTokenResolver: CaptchaTokenResolver
  Regtest?: {
    apiURL?: string
  }
}
