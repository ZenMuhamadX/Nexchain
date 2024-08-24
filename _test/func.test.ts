import { BlockChains } from '../src/block/blockChains'
import { block } from '../src/block/block'
import { TxPool } from '../src/Tx/TxPool'
import { transaction } from '../src/Tx/Tx'
import { generateBlockHash } from '../src/lib/generateHash' // Pastikan nama fungsi benar
import { generateTimestampz } from '../src/lib/generateTimestampz'

// Mock `generateBlockHash` dan `generateTimestampz` untuk memastikan hasil yang konsisten
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

  test('should create an initial blockchain with one genesis block', () => {
    const chains = blockChains.getChains()
    expect(chains).toHaveLength(1)
    expect(chains[0].index).toBe(0)
    expect(chains[0].transactions).toEqual([]) // Blok genesis biasanya tidak memiliki transaksi
  })

  test('should add a block with transactions from the pool', () => {
    // Simulasi transaksi
    const tx: transaction = { sender: 'Alice', receiver: 'Bob', amount: 100 }
    txPool.addTx(tx)

    // Tambahkan transaksi ke pool
    blockChains.addTxToBlock(txPool)

    const chains = blockChains.getChains()
    const lastBlock = blockChains.getLastBlock()

    // Pastikan blok baru ditambahkan
    expect(chains).toHaveLength(2)
    expect(lastBlock.index).toBe(1)
    expect(lastBlock.timestamp).toBe('mockedTimestamp')
    expect(lastBlock.hash).toBe('mockedHash')
    expect(lastBlock.transactions).toHaveLength(1) // Harus ada 1 transaksi
    expect(lastBlock.transactions[0]).toEqual(tx)
    expect(txPool.getPendingTx()).toHaveLength(0) // Pool harus kosong setelah ditambahkan
  })

  test('should validate a valid chain', () => {
    // Simulasi transaksi
    const tx: transaction = { sender: 'Alice', receiver: 'Bob', amount: 100 }
    txPool.addTx(tx)

    // Tambahkan transaksi ke pool
    blockChains.addTxToBlock(txPool)

    // Validasi rantai
    expect(blockChains.isChainValid()).toBe(true)
  })

  test('should invalidate a tampered chain', () => {
    // Simulasi transaksi
    const tx: transaction = { sender: 'Alice', receiver: 'Bob', amount: 100 }
    txPool.addTx(tx)

    // Tambahkan transaksi ke pool
    blockChains.addTxToBlock(txPool)

    // Mengubah blok untuk membuat rantai tidak valid
    const chains = blockChains.getChains()
    chains[1].transactions[0].amount = 5000 // Modifikasi transaksi di blok

    // Validasi rantai
    expect(blockChains.isChainValid()).toBe(false)
  })
})
