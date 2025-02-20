import { describe, test, expect, jest } from '@jest/globals'
import fetch from 'cross-fetch'

import { getHttpClient } from './crossFetch'
import { BridgeError } from './httpClient'

import JSONbig from 'json-bigint'

jest.mock('cross-fetch')

const mockCaptchaToken = 'token'
const crossFetch = getHttpClient(async () => Promise.resolve(mockCaptchaToken))

const mockedFetch = fetch as jest.Mock<typeof fetch>

function getResponseErrorMock (arg: { clientSide: boolean } = { clientSide: true }): Response {
  return new Response(JSON.stringify({
    message: 'error signing quote: cannot decode invalid into a string type',
    details: {},
    timestamp: 1676480092,
    recoverable: true
  }), { status: arg.clientSide ? 400 : 500 })
}

describe('Cross fetch client implementation should', () => {
  test('throw FlyoverError on GET client side error', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(getResponseErrorMock()))
    await expect(crossFetch.get('url')).rejects.toThrow(BridgeError)
  })

  test('throw FlyoverError on POST client side error', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(getResponseErrorMock({ clientSide: false })))
    await expect(crossFetch.post('url', { value: 5 })).rejects.toThrow(BridgeError)
  })

  test('throw FlyoverError on GET server side error', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(getResponseErrorMock({ clientSide: false })))
    await expect(crossFetch.get('url')).rejects.toThrow(BridgeError)
  })

  test('throw FlyoverError on POST server side error', async () => {
    mockedFetch.mockReturnValueOnce(Promise.resolve(getResponseErrorMock()))
    await expect(crossFetch.post('url', { value: 5 })).rejects.toThrow(BridgeError)
  })

  test('set error fields correctly', async () => {
    let error: BridgeError | undefined
    mockedFetch.mockReturnValueOnce(Promise.resolve(getResponseErrorMock()))
    try {
      await crossFetch.get('any url')
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
    const response = await crossFetch.get('any url')
    expect(response).toEqual({ value: 7 })
  })

  test('serialize and deserialize bigint', async () => {
    mockedFetch.mockReturnValueOnce(
      Promise.resolve(
        new Response(JSONbig.stringify({ value: BigInt('123456789012345678901234567890') }), { status: 200 })
      )
    )

    const response = await crossFetch.post('any url', { value: BigInt('509324520935263456336757') }) as any

    expect(mockedFetch).toBeCalledWith('any url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"value":509324520935263456336757}'
    })
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
        await crossFetch.post('any url', { value: 'any' })
        expect(mockedFetch).toBeCalledWith('any url', postRqWithoutCaptcha)
      },
      async () => {
        await crossFetch.post('any url', { value: 'any' }, { includeCaptcha: true })
        expect(mockedFetch).toBeCalledWith('any url', postRqWithCaptcha)
      },
      async () => {
        await crossFetch.get('any url')
        expect(mockedFetch).toBeCalledWith('any url')
      },
      async () => {
        await crossFetch.get('any url', { includeCaptcha: true })
        expect(mockedFetch).toBeCalledWith('any url', getRqWithCaptcha)
      }
    ]

    for (const testCase of testCases) {
      await testCase()
      mockedFetch.mockClear()
    }
  })
})
