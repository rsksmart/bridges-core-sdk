
export interface HttpClientOptions {
  includeCaptcha: boolean
}
export interface HttpClient {
  get: <T>(url: string, options?: Partial<HttpClientOptions>) => Promise<T>
  post: <T>(url: string, body: object, options?: Partial<HttpClientOptions>) => Promise<T>
  getCaptchaToken: CaptchaTokenResolver
}

export type CaptchaTokenResolver = () => Promise<string>

export interface ErrorDetails {
  timestamp: number
  recoverable: boolean
  message: string
  serverUrl?: string
  details: unknown
  product?: string
}
export class BridgeError extends Error {
  timestamp: number
  recoverable: boolean
  details: any
  serverUrl?: string
  product?: string
  constructor (args: ErrorDetails) {
    super(args.message)
    this.timestamp = args.timestamp
    this.recoverable = args.recoverable
    this.details = args.details
    this.serverUrl = args.serverUrl
    this.product = args.product
  }
}
