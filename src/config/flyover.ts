import { type BridgesConfig } from '.'
import { type CaptchaTokenResolver } from '../client'

/** Interface for the flyover client connection configuration */
export interface FlyoverConfig extends BridgesConfig {
  /** Is a custom url for users that want to use other LBC, for example, a local one for testing purposes */
  customLbcAddress?: string
  /** Is a custom address of the FlyoverConfigurations contract, for networks without a default one or for local testing */
  customFlyoverConfigurationsAddress?: string
  /** Is a custom address of the PegOutEscrow contract, for networks without a default one or for local testing */
  customPegOutEscrowAddress?: string
  /** Is a custom address of the PegOutContract, for networks whose deployment differs from the default one or for local testing */
  customPegOutContractAddress?: string
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
