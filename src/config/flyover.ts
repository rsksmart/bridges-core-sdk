import { type BridgesConfig } from '.'
import { type CaptchaTokenResolver } from '../client'

/** Interface for the flyover client connection configuration */
export interface FlyoverConfig extends BridgesConfig {
  /** Is a custom url for users that want to use other LBC, for example, a local one for testing purposes */
  customLbcAddress?: string
  /**
   * Custom address of the PegInAddressRegistry contract. Useful to override the
   * (regtest/dev) default, or to point at a freshly deployed registry while no
   * canonical mainnet/testnet deployment exists yet.
   */
  customPegInAddressRegistryAddress?: string
  /**
   * Custom address of the FlyoverConfigurations contract. Useful to override the
   * (regtest/dev) default, or to point at a freshly deployed configurations
   * contract while no canonical mainnet/testnet deployment exists yet.
   */
  customFlyoverConfigurationsAddress?: string
  /** @deprecated Will be removed in future releases */
  customRegtestUrl?: string
  /**
   * Function that will be called to get the captcha token returned from a successful captcha challenge
   */
  captchaTokenResolver: CaptchaTokenResolver
  /**
   * Whether to disable the checksum validation for the RSK addresses or not
   * @default false
   */
  disableChecksum?: boolean
}
