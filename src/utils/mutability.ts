
export function deepFreeze<T extends object> (obj: T): T {
  Object.entries(obj).forEach((entry) => {
    const key = entry[0]
    const value = entry[1]
    if (typeof value === 'object' && !Object.isFrozen(value)) {
      (obj as any)[key] = deepFreeze(value)
    }
  })
  return Object.freeze(obj)
}
