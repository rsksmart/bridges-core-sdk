import fetch from 'cross-fetch'
import JSONbig from 'json-bigint'
import { type CaptchaTokenResolver, type HttpClient, type HttpClientOptions, BridgeError } from './httpClient'

const serializer = JSONbig({ useNativeBigInt: true })

export const DEFAULT_MAX_RESPONSE_BYTES = 256 * 1024
export const DEFAULT_MAX_RESPONSE_TIME_MS = 60_000

export function getHttpClient (resolveCaptchaToken: CaptchaTokenResolver): HttpClient {
  return {
    getCaptchaToken: resolveCaptchaToken,

    async get<T>(url: string, options?: Partial<HttpClientOptions>): Promise<T> {
      const headers: HeadersInit | undefined = (options != null) && options.includeCaptcha === true
        ? {
            'Content-Type': 'application/json',
            'X-Captcha-Token': await this.getCaptchaToken()
          }
        : undefined
      return request<T>(url, headers != null ? { headers } : undefined, options)
    },

    async post<T>(url: string, body: object, options?: Partial<HttpClientOptions>): Promise<T> {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (options?.includeCaptcha === true) {
        headers['X-Captcha-Token'] = await this.getCaptchaToken()
      }
      return request<T>(url, {
        method: 'POST', headers, body: serializer.stringify(body)
      }, options)
    }
  }
}

async function request<T> (
  url: string,
  init: RequestInit | undefined,
  options?: Partial<HttpClientOptions>
): Promise<T> {
  const maxBytes = options?.maxResponseBytes ?? DEFAULT_MAX_RESPONSE_BYTES
  const maxTimeMs = options?.maxResponseTimeMs ?? DEFAULT_MAX_RESPONSE_TIME_MS
  const abortController = new AbortController()
  let timedOut = false
  const timeoutId = setTimeout(() => {
    timedOut = true
    abortController.abort()
  }, maxTimeMs)

  try {
    const response = await fetch(url, { ...init, signal: abortController.signal })
    return await handleResponse<T>(response, maxBytes, abortController)
  } catch (error) {
    if (abortController.signal.aborted && timedOut) {
      throw new Error(`Request exceeded maximum time of ${maxTimeMs} ms`)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

async function readBodyWithLimit (
  response: Response,
  maxBytes: number,
  abortController: AbortController
): Promise<string> {
  if (response.body == null) {
    return ''
  }

  const reader = response.body.getReader()
  let totalBytes: number, chunks: Uint8Array[], overflow: boolean

  try {
    ({
      totalBytes,
      chunks,
      overflow
    } = await readByteStream({ reader, maxBytes, abortController }))
  } catch (error) {
    await freeResources({ reader, abortController })
    throw error
  }

  if (overflow) {
    await freeResources({ reader, abortController })
    throw new Error(`Response body exceeds maximum size of ${maxBytes} bytes`)
  }

  const buffer = new Uint8Array(totalBytes)
  let offset = 0
  for (const chunk of chunks) {
    buffer.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(buffer)
}

async function readByteStream (
  args: {
    reader: ReadableStreamDefaultReader<Uint8Array>
    maxBytes: number
    abortController: AbortController
  }
): Promise<{ chunks: Uint8Array[], totalBytes: number, overflow: boolean }> {
  const chunks: Uint8Array[] = []
  const { reader, maxBytes, abortController } = args
  let totalBytes = 0
  let done = false
  let value: Uint8Array | undefined
  while (!done) {
    if (abortController.signal.aborted) {
      throw new Error('The operation was aborted.')
    }
    const result = await reader.read()
    done = result.done
    value = result.value
    if (done || value == null) {
      return { chunks, totalBytes, overflow: false }
    }
    totalBytes += value.byteLength
    if (totalBytes > maxBytes) {
      return { chunks, totalBytes, overflow: true }
    }
    chunks.push(value)
  }
  return { chunks, totalBytes, overflow: false }
}

async function freeResources (args: {
  reader: ReadableStreamDefaultReader<Uint8Array>
  abortController: AbortController
}): Promise<void> {
  const { reader, abortController } = args
  await reader.cancel().catch(() => undefined)
  if (!abortController.signal.aborted) {
    abortController.abort()
  }
}

async function handleResponse<T> (
  response: Response,
  maxBytes: number,
  abortController: AbortController
): Promise<T> {
  const text = await readBodyWithLimit(response, maxBytes, abortController)
  if (response.status >= 400) {
    const responseBody: any = serializer.parse(text)
    throw new BridgeError({
      serverUrl: response.url,
      message: responseBody.message,
      timestamp: responseBody.timestamp,
      recoverable: responseBody.recoverable,
      details: responseBody.details
    })
  }
  return serializer.parse(text)
}
