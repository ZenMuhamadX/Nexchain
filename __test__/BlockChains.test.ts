import { Block } from './../src/model/Block'
import { BlockChains } from '../src/blockChains'
import { TxPool } from '../src/Tx/TxPool'
import { createGenesisBlock } from '../src/lib/createGenesisBlock'
import { generateBlockHash } from '../src/lib/generateHash'
import { generateTimestampz } from '../src/lib/generateTimestampz'

jest.mock('../lib/generateHash')
jest.mock('../lib/generateTimestampz')

describe('BlockChains', () => {
  let blockChains: BlockChains
  let txPool: TxPool

  beforeEach(() => {
    blockChains = new BlockChains()
    txPool = new TxPool()

    // Mocking timestamp and hash for consistency in tests
    ;(generateTimestampz as jest.Mock).mockReturnValue('2024-01-02T00:00:00Z')
    ;(generateBlockHash as jest.Mock).mockReturnValue('dummy-hash')
  })

  test('should create the genesis block', () => {
    const chains = blockChains.getChains()
    expect(chains.length).toBe(1)
    expect(chains[0].index).toBe(0)
    expect(chains[0].timestamp).toBe('2024-01-01T00:00:00Z')
    expect(chains[0].hash).toBe('dummy-hash')
  })

  test('should add transaction to a new block', () => {
    txPool.getPendingTx = jest.fn().mockReturnValue([{ id: 1, amount: 100 }])
    blockChains.addTxToBlock(txPool)

    const chains = blockChains.getChains()
    expect(chains.length).toBe(2)
    expect(chains[1].transactions).toEqual([{ id: 1, amount: 100 }])
    expect(chains[1].previousHash).toBe('dummy-hash')
  })

  test('should validate chain correctly', () => {
    expect(blockChains.isChainValid()).toBe(true)

    // Modify the hash to simulate an invalid chain
    const blocks = blockChains[' _chains']
    blocks[1].hash = 'invalid-hash'

    expect(blockChains.isChainValid()).toBe(false)
  })
})
