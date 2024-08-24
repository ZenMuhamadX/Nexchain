// __tests__/generateTimestampz.test.ts
import { generateTimestampz } from '../src/lib/generateTimestampz'

describe('generateTimestampz', () => {
  test('should generate a timestamp', () => {
    const timestamp = generateTimestampz()
    expect(new Date(timestamp).toISOString()).toBe(timestamp)
  })
})
