import { describe, test, expect } from '@jest/globals'
import { deepFreeze } from './mutability'

describe('deepFreeze function should', () => {
  test('freeze single level object correctly', () => {
    const person = {
      name: 'luis',
      age: 22
    }
    const freezed = deepFreeze(person)

    expect(() => {
      freezed.age = 23
    }).toThrow()
  })

  test('freeze multi level object correctly', () => {
    const person = {
      name: 'luis',
      age: 22,
      pet: {
        kind: 'dog',
        name: 'max'
      }
    }
    const freezed = deepFreeze(person)
    expect(() => { freezed.pet.kind = 'cat' }).toThrow()
    expect(() => { freezed.age = 23 }).toThrow()
  })
})
