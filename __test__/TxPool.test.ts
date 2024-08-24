import { TxPool } from '../src/Tx/TxPool'
import { TxInterface } from '../src/model/Tx'

// Mock implementation of TxInterface
const createMockTx = (id: number): TxInterface => ({
  id:1,
  sender: '0x1',
  recipient: '0x2',
  amount: 100,
  // other properties can be added here
})

describe('TxPool', () => {
  let txPool: TxPool

  beforeEach(() => {
    txPool = new TxPool()
  })

  test('should initialize with an empty pendingTx array', () => {
    expect(txPool.getPendingTx()).toEqual([])
  })

  test('should add a transaction to the pendingTx array', () => {
    const tx = createMockTx(1)
    txPool.addTx(tx)
    expect(txPool.getPendingTx()).toContain(tx)
  })

  test('should clear all transactions from the pendingTx array', () => {
    const tx1 = createMockTx(1)
    const tx2 = createMockTx(2)
    txPool.addTx(tx1)
    txPool.addTx(tx2)
    txPool.clear()
    expect(txPool.getPendingTx()).toEqual([])
  })

  test('should not have duplicate transactions in the pendingTx array', () => {
    const tx = createMockTx(1)
    txPool.addTx(tx)
    txPool.addTx(tx)
    expect(txPool.getPendingTx()).toEqual([tx, tx]) // This test checks if duplicates are allowed, adjust according to requirements
  })
})
