import { describe, test, expect, jest, beforeEach, afterEach, afterAll } from '@jest/globals'

import { DEFAULT_MAX_RESPONSE_BYTES, DEFAULT_MAX_RESPONSE_TIME_MS, getHttpClient } from './fetch'
import { BridgeError } from './httpClient'

import JSONbig from 'json-bigint'

const mockCaptchaToken = 'token'
const mockedFetch = jest.spyOn(globalThis, 'fetch')
const fetchClient = getHttpClient(async () => Promise.resolve(mockCaptchaToken))

beforeEach(() => {
  mockedFetch.mockReset()
})

afterAll(() => {
  mockedFetch.mockRestore()
})

function getResponseErrorMock (arg: { clientSide: boolean } = { clientSide: true }): Response {
  return new Response(JSON.stringify({
    message: 'error signing quote: cannot decode invalid into a string type',
    details: {},
    timestamp: 1676480092,
    recoverable: true
  }), { status: arg.clientSide ? 400 : 500 })
}

function getOversizedResponse (byteCount: number, status = 200): Response {
  const stream = new ReadableStream({
    start (controller) {
      controller.enqueue(new Uint8Array(byteCount).fill(97))
      controller.close()
    }
  })
  return new Response(stream, { status })
}

function getMultiChunkOversizedResponse (byteCount: number, status = 200): Response {
  const firstChunkSize = Math.floor(byteCount / 2)
  const stream = new ReadableStream({
    start (controller) {
      controller.enqueue(new Uint8Array(firstChunkSize).fill(97))
      controller.enqueue(new Uint8Array(byteCount - firstChunkSize).fill(97))
      controller.close()
    }
  })
  return new Response(stream, { status })
}

async function mockHangingFetch (init?: RequestInit): Promise<Response> {
  return new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => {
      reject(new DOMException('The operation was aborted.', 'AbortError'))
    }, { once: true })
  })
}

function mockSlowBodyResponse (init?: RequestInit): Response {
  return new Response(new ReadableStream({
    pull (controller) {
      init?.signal?.addEventListener('abort', () => {
        controller.error(new DOMException('The operation was aborted.', 'AbortError'))
      }, { once: true })
    }
  }), { status: 200 })
}

describe('Fetch client implementation should', () => {
  test('throw FlyoverError on GET client side error', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(getResponseErrorMock()))
    await expect(fetchClient.get('url')).rejects.toThrow(BridgeError)
  })

  test('throw FlyoverError on POST client side error', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(getResponseErrorMock({ clientSide: false })))
    await expect(fetchClient.post('url', { value: 5 })).rejects.toThrow(BridgeError)
  })

  test('throw FlyoverError on GET server side error', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(getResponseErrorMock({ clientSide: false })))
    await expect(fetchClient.get('url')).rejects.toThrow(BridgeError)
  })

  test('throw FlyoverError on POST server side error', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(getResponseErrorMock()))
    await expect(fetchClient.post('url', { value: 5 })).rejects.toThrow(BridgeError)
  })

  test('set error fields correctly', async () => {
    let error: BridgeError | undefined
    mockedFetch.mockReturnValueOnce(Promise.resolve(getResponseErrorMock()))
    try {
      await fetchClient.get('any url')
    } catch (e: any) {
      error = e
    }
    expect(error?.details).toBeTruthy()
    expect(error?.recoverable).not.toBeUndefined()
    expect(error?.timestamp).toBeTruthy()
    expect(error?.message).not.toBeUndefined()
  })

  test('parse json response', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(new Response(JSON.stringify({ value: 7 }), { status: 200 })))
    const response = await fetchClient.get('any url')
    expect(response).toEqual({ value: 7 })
  })

  test('serialize and deserialize bigint', async () => {
    mockedFetch.mockReturnValueOnce(
      Promise.resolve(
        new Response(JSONbig.stringify({ value: BigInt('123456789012345678901234567890') }), { status: 200 })
      )
    )

    const response = await fetchClient.post('any url', { value: BigInt('509324520935263456336757') }) as any

    expect(mockedFetch).toBeCalledWith('any url', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"value":509324520935263456336757}'
    }))
    expect(response.value.toString()).toBe('123456789012345678901234567890')
    expect(typeof response.value).toBe('bigint')
  })

  test('include captcha token only when provided', async () => {
    mockedFetch.mockImplementation(async () => Promise.resolve(new Response(JSON.stringify({ value: 7 }), { status: 200 })))

    const postRqWithCaptcha = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Captcha-Token': mockCaptchaToken
      },
      body: '{"value":"any"}'
    }

    const postRqWithoutCaptcha = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"value":"any"}'
    }

    const getRqWithCaptcha = {
      headers: {
        'Content-Type': 'application/json',
        'X-Captcha-Token': mockCaptchaToken
      }
    }

    const testCases: Array<() => Promise<void>> = [
      async () => {
        await fetchClient.post('any url', { value: 'any' })
        expect(mockedFetch).toBeCalledWith('any url', expect.objectContaining(postRqWithoutCaptcha))
      },
      async () => {
        await fetchClient.post('any url', { value: 'any' }, { includeCaptcha: true })
        expect(mockedFetch).toBeCalledWith('any url', expect.objectContaining(postRqWithCaptcha))
      },
      async () => {
        await fetchClient.get('any url')
        expect(mockedFetch).toBeCalledWith('any url', expect.objectContaining({}))
      },
      async () => {
        await fetchClient.get('any url', { includeCaptcha: true })
        expect(mockedFetch).toBeCalledWith('any url', expect.objectContaining(getRqWithCaptcha))
      }
    ]

    for (const testCase of testCases) {
      await testCase()
      mockedFetch.mockClear()
    }
  })

  test('reject success responses above the default size limit', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(getOversizedResponse(DEFAULT_MAX_RESPONSE_BYTES + 1)))
    await expect(fetchClient.get('any url')).rejects.toThrow(
      `Response body exceeds maximum size of ${DEFAULT_MAX_RESPONSE_BYTES} bytes`
    )
  })

  test('reject error responses above the default size limit', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(getOversizedResponse(DEFAULT_MAX_RESPONSE_BYTES + 1, 400)))
    await expect(fetchClient.get('any url')).rejects.toThrow(
      `Response body exceeds maximum size of ${DEFAULT_MAX_RESPONSE_BYTES} bytes`
    )
  })

  test('respect custom maxResponseBytes limit', async () => {
    const customLimit = 512
    mockedFetch.mockReturnValueOnce(Promise.resolve(getOversizedResponse(customLimit + 1)))
    await expect(fetchClient.get('any url', { maxResponseBytes: customLimit })).rejects.toThrow(
      `Response body exceeds maximum size of ${customLimit} bytes`
    )
  })

  describe('response size limit', () => {
    test('reject POST success responses above the size limit', async () => {
      mockedFetch.mockReturnValueOnce(Promise.resolve(getOversizedResponse(1024)))
      await expect(fetchClient.post('any url', { value: 1 }, { maxResponseBytes: 512 })).rejects.toThrow(
        'Response body exceeds maximum size of 512 bytes'
      )
    })

    test('reject POST error responses above the size limit', async () => {
      mockedFetch.mockReturnValueOnce(Promise.resolve(getOversizedResponse(1024, 500)))
      await expect(fetchClient.post('any url', { value: 1 }, { maxResponseBytes: 512 })).rejects.toThrow(
        'Response body exceeds maximum size of 512 bytes'
      )
    })

    test('allow responses exactly at the byte limit', async () => {
      const body = JSON.stringify({ value: 7 })
      mockedFetch.mockReturnValueOnce(Promise.resolve(new Response(body, { status: 200 })))
      await expect(fetchClient.get('any url', { maxResponseBytes: body.length })).resolves.toEqual({ value: 7 })
    })

    test('reject multi-chunk responses that exceed the limit cumulatively', async () => {
      const customLimit = 512
      mockedFetch.mockReturnValueOnce(Promise.resolve(getMultiChunkOversizedResponse(customLimit + 1)))
      await expect(fetchClient.get('any url', { maxResponseBytes: customLimit })).rejects.toThrow(
        `Response body exceeds maximum size of ${customLimit} bytes`
      )
    })

    test('not misclassify size limit errors as timeout errors', async () => {
      mockedFetch.mockReturnValueOnce(Promise.resolve(getOversizedResponse(1024)))
      await expect(fetchClient.get('any url', { maxResponseBytes: 512 })).rejects.toThrow(
        'Response body exceeds maximum size of 512 bytes'
      )
    })
  })

  describe('response time limit', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    test('reject requests that exceed the default time limit', async () => {
      mockedFetch.mockImplementation(async (_url, init) => mockHangingFetch(init))

      const promise = fetchClient.get('any url')
      const expectation = expect(promise).rejects.toThrow(
        `Request exceeded maximum time of ${DEFAULT_MAX_RESPONSE_TIME_MS} ms`
      )
      await jest.advanceTimersByTimeAsync(DEFAULT_MAX_RESPONSE_TIME_MS + 1)
      await expectation
    })

    test('reject POST requests that exceed the time limit', async () => {
      const customLimit = 2000
      mockedFetch.mockImplementation(async (_url, init) => mockHangingFetch(init))

      const promise = fetchClient.post('any url', { value: 1 }, { maxResponseTimeMs: customLimit })
      const expectation = expect(promise).rejects.toThrow(
        `Request exceeded maximum time of ${customLimit} ms`
      )
      await jest.advanceTimersByTimeAsync(customLimit + 1)
      await expectation
    })

    test('reject responses that take too long to download', async () => {
      const customLimit = 1000
      mockedFetch.mockImplementation(async (_url, init) => {
        return Promise.resolve(mockSlowBodyResponse(init))
      })

      const promise = fetchClient.get('any url', { maxResponseTimeMs: customLimit })
      const expectation = expect(promise).rejects.toThrow(
        `Request exceeded maximum time of ${customLimit} ms`
      )
      await jest.advanceTimersByTimeAsync(customLimit + 1)
      await expectation
    })

    test('allow responses within the time limit', async () => {
      mockedFetch.mockReturnValueOnce(Promise.resolve(new Response(JSON.stringify({ value: 7 }), { status: 200 })))
      const promise = fetchClient.get('any url', { maxResponseTimeMs: 1000 })
      await jest.advanceTimersByTimeAsync(500)
      await expect(promise).resolves.toEqual({ value: 7 })
    })

    test('propagate non-timeout errors unchanged', async () => {
      mockedFetch.mockRejectedValueOnce(new Error('Network failure'))
      await expect(fetchClient.get('any url')).rejects.toThrow('Network failure')
    })
  })

  describe('request configuration', () => {
    test('pass an AbortSignal to fetch', async () => {
      mockedFetch.mockImplementationOnce(async (_url, init) => {
        expect(init?.signal).toBeInstanceOf(AbortSignal)
        return Promise.resolve(new Response(JSON.stringify({ value: 7 }), { status: 200 }))
      })
      await fetchClient.get('any url')
    })
  })
})
