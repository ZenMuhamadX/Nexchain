// __tests__/createGenesisBlock.test.ts
import { createGenesisBlock } from '../src/lib/createGenesisBlock'
import { Block } from '../src/model/Block'

describe('createGenesisBlock', () => {
  test('should create a genesis block', () => {
    const genesisBlock = createGenesisBlock()
    expect(genesisBlock).toBeInstanceOf(Block)
    expect(genesisBlock.index).toBe(0)
    expect(genesisBlock.timestamp).toBe('2024-01-01T00:00:00Z')
    expect(genesisBlock.previousHash).toBe('')
  })
})
