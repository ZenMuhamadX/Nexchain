// __tests__/generateHash.test.ts
import { generateBlockHash } from '../src/lib/generateHash'

describe('generateBlockHash', () => {
  test('should generate a hash for the block', () => {
    const hash = generateBlockHash(
      1,
      '2024-01-02T00:00:00Z',
      [],
      'dummy-prev-hash'
    )
    expect(hash).toBe('dummy-hash')
  })
})
