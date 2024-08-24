// __tests__/Block.test.ts
import { Block } from '../src/model/Block'

describe('Block', () => {
  let block: Block

  beforeEach(() => {
    block = new Block(1, '2024-01-02T00:00:00Z', [], 'dummy-prev-hash')
  })

  test('should create a block with correct properties', () => {
    expect(block.index).toBe(1)
    expect(block.timestamp).toBe('2024-01-02T00:00:00Z')
    expect(block.previousHash).toBe('dummy-prev-hash')
    expect(block.getTransactions()).toEqual([])
  })

  // Add more tests if you implement additional methods in Block class
})
