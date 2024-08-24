// BlockChains.test.ts
import { BlockChains } from './BlockChains'
import { TxPool } from './Tx/TxPool'
import { Block } from './model/Block'
import { generateBlockHash } from './lib/generateHash'
import { generateTimestampz } from './lib/generateTimestampz'
import { createGenesisBlock } from './lib/createGenesisBlock'

// Mocking dependencies
jest.mock('./lib/generateHash', () => ({
  generateBlockHash: jest.fn()
}))

jest.mock('./lib/generateTimestampz', () => ({
  generateTimestampz: jest.fn()
}))

jest.mock('./lib/createGenesisBlock', () => ({
  createGenesisBlock: jest.fn()
}))

describe('BlockChains', () => {
  let blockChains: BlockChains
  let mockTxPool: TxPool
  let mockBlock: Block

  beforeEach(() => {
    blockChains = new BlockChains()
    mockTxPool = {
      getPendingTx: jest.fn().mockReturnValue([]),
      clear: jest.fn()
    } as unknown as TxPool
    mockBlock = new Block(0, '2024-01-01T00:00:00Z', [], '', 'genesis-hash')
    
    (createGenesisBlock as jest.Mock).mockReturnValue(mockBlock)
    (generateBlockHash as jest.Mock).mockReturnValue('genesis-hash')
    (generateTimestampz as jest.Mock).mockReturnValue('2024-01-01T00:00:00Z')
  })

  test('should initialize with genesis block', () => {
    expect(blockChains.getChains()).toEqual([{
      index: 0,
      timestamp: '2024-01-01T00:00:00Z',
      transactions: [],
      previousHash: '',
      hash: 'genesis-hash'
    }])
  })

  test('should add transaction to block', () => {
    const newBlock = new Block(1, '2024-01-01T00:00:00Z', [], 'genesis-hash')
    blockChains.addTxToBlock(mockTxPool)

    expect(blockChains.getChains().length).toBe(2)
    expect(blockChains.getLatestBlock()).toEqual(newBlock)
    expect(mockTxPool.clear).toHaveBeenCalled()
  })

  test('should validate chain correctly', () => {
    const validBlock = new Block(
      1,
      '2024-01-01T00:00:00Z',
      [],
      'genesis-hash',
      'valid-hash'
    )
    (generateBlockHash as jest.Mock).mockReturnValue('valid-hash')
    blockChains.addTxToBlock(mockTxPool)

    expect(blockChains.isChainValid()).toBe(true)
  })

  test('should invalidate chain with incorrect hash', () => {
    const invalidBlock = new Block(
      1,
      '2024-01-01T00:00:00Z',
      [],
      'genesis-hash',
      'invalid-hash'
    )
    (generateBlockHash as jest.Mock).mockReturnValue('valid-hash')
    blockChains.addTxToBlock(mockTxPool)

    expect(blockChains.isChainValid()).toBe(false)
  })
})
