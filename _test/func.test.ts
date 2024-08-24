import { BlockChains } from '../src/block/blockChains'
import { block } from '../src/block/block'
import { TxPool } from '../src/Tx/TxPool'
import { transactionInterface } from '../src/Tx/Tx'
import { generateBlockHash } from '../src/lib/generateHash' // Pastikan nama fungsi benar
import { generateTimestampz } from '../src/lib/generateTimestampz'

// Mock `generateBlockHash` dan `generateTimestampz` untuk hasil yang konsisten
jest.mock('../src/lib/generateHash', () => ({
  generateBlockHash: jest.fn().mockReturnValue('mockedHash'),
}))

jest.mock('../src/lib/generateTimestampz', () => ({
  generateTimestampz: jest.fn().mockReturnValue('mockedTimestamp'),
}))

describe('BlockChains', () => {
  let blockChains: BlockChains
  let txPool: TxPool

  beforeEach(() => {
    blockChains = new BlockChains()
    txPool = new TxPool()
  })

  test('should initialize with a genesis block', () => {
    const chains = blockChains.getChains()
    expect(chains).toHaveLength(1)
    expect(chains[0].index).toBe(0) // Genesis block index
    expect(chains[0].previousHash).toBe('') // Genesis block should have an empty previousHash
  })

  test('should add a block with transactions from the pool', () => {
    // Simulasi transaksi
    const tx: transactionInterface = {
      sender: 'Alice',
      receiver: 'Bob',
      amount: 100,
    }
    txPool.addTx(tx)

    // Tambahkan transaksi ke pool dan blok
    blockChains.addTxToBlock(txPool)

    const chains = blockChains.getChains()
    const lastBlock = blockChains.getLatestBlock()

    // Pastikan blok baru ditambahkan
    expect(chains).toHaveLength(2) // Genesis block + 1 new block
    expect(lastBlock.index).toBe(1) // New block index should be 1
    expect(lastBlock.timestamp).toBe('mockedTimestamp') // Mocked timestamp
    expect(lastBlock.hash).toBe('mockedHash') // Mocked hash
    expect(lastBlock.getTransactions()).toHaveLength(1) // Should contain 1 transaction
    expect(lastBlock.getTransactions()[0]).toEqual(tx) // Transaction should match the added transaction
  })

  test('should validate a valid chain', () => {
    // Simulasi transaksi
    const tx: transactionInterface = {
      sender: 'Alice',
      receiver: 'Bob',
      amount: 100,
    }
    txPool.addTx(tx)

    // Tambahkan transaksi ke pool dan blok
    blockChains.addTxToBlock(txPool)

    console.log(blockChains.getChains())
    // Validasi rantai
    expect(blockChains.isChainValid()).toBe(true)
  })
})
