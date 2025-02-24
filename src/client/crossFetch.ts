import fetch from 'cross-fetch'
import JSONbig from 'json-bigint'
import { type CaptchaTokenResolver, type HttpClient, type HttpClientOptions, BridgeError } from './httpClient'

const serializer = JSONbig({ useNativeBigInt: true })

export function getHttpClient (resolveCaptchaToken: CaptchaTokenResolver): HttpClient {
  return {
    getCaptchaToken: resolveCaptchaToken,

    async get<T>(url: string, options?: Partial<HttpClientOptions>): Promise<T> {
      let request: Promise<Response>
      if ((options != null) && options.includeCaptcha === true) {
        const token = await this.getCaptchaToken()
        request = fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'X-Captcha-Token': token
          }
        })
      } else {
        request = fetch(url)
      }
      return request.then(async res => handleResponse(res))
    },

    async post<T>(url: string, body: object, options?: Partial<HttpClientOptions>): Promise<T> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (options?.includeCaptcha === true) {
        const token = await this.getCaptchaToken()
        headers['X-Captcha-Token'] = token
      }
      return fetch(url, {
        method: 'POST', headers, body: serializer.stringify(body)
      }).then(async res => handleResponse(res))
    }
  }
}

async function handleResponse<T> (response: Response): Promise<T> {
  if (response.status >= 400) {
    const responseBody: any = await response.json()
    throw new BridgeError({
      serverUrl: response.url,
      message: responseBody.message,
      timestamp: responseBody.timestamp,
      recoverable: responseBody.recoverable,
      details: responseBody.details
    })
  }
  return response.text().then(text => serializer.parse(text))
}
