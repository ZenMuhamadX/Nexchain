// BlockChains.test.ts
import { BlockChains } from '../src/BlockChains'
import { TxPool } from '../src/Tx/TxPool'
import { Block } from '../src/model/Block'
import { generateBlockHash } from '../src/lib/generateHash'
import { generateTimestampz } from '../src/lib/generateTimestampz'
import { createGenesisBlock } from '../src/lib/createGenesisBlock'
import { TxInterface } from '../src/model/Tx'

// Mocking dependencies
jest.mock('./lib/generateHash', () => ({
  generateBlockHash: jest.fn(),
}))

jest.mock('./lib/generateTimestampz', () => ({
  generateTimestampz: jest.fn(),
}))

jest.mock('./lib/createGenesisBlock', () => ({
  createGenesisBlock: jest.fn(),
}))

describe('BlockChains', () => {
  let blockChains: BlockChains
  let mockTxPool: TxPool
  beforeEach(() => {
    blockChains = new BlockChains()
    mockTxPool = {
      getPendingTx: jest.fn().mockReturnValue([]),
      clear: jest.fn(),
    } as unknown as TxPool
  })

  test('should initialize with genesis block', () => {
    const index = 0
    const timestamp = '2024-01-01T00:00:00Z'
    const transactions: TxInterface[] = [
      { amount: 0, recipient: '', sender: '', id: 0, message: 'Genesis Block' },
    ]
    const previousHash = ''
    expect(blockChains.getChains()).toEqual([
      {
        index,
        timestamp,
        transactions,
        previousHash,
        hash: generateBlockHash(index, timestamp, transactions, previousHash),
      },
    ])
  })

  test('should add transaction to block', () => {
    const newBlock = new Block(1, '2024-01-01T00:00:00Z', [], 'genesis-hash')
    blockChains.addTxToBlock(mockTxPool)

    expect(blockChains.getChains().length).toBe(2)
    expect(blockChains.getLatestBlock()).toEqual(newBlock)
    expect(mockTxPool.clear).toHaveBeenCalled()
  })

  test('should validate chain correctly', () => {
    new Block(1, '2024-01-01T00:00:00Z', [], 'genesis-hash')
    blockChains.addTxToBlock(mockTxPool)

    expect(blockChains.isChainValid()).toBe(true)
  })

  test('should invalidate chain with incorrect hash', () => {
    new Block(1, '2024-01-01T00:00:00Z', [], 'genesis-hash')
    blockChains.addTxToBlock(mockTxPool)

    expect(blockChains.isChainValid()).toBe(false)
  })
})
