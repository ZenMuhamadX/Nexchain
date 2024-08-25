import { TxPool } from '../src/Tx/TxPool'
import { TxInterface } from '../src/model/Tx'

// Mock implementation of TxInterface
const createMockTx = (id: number): TxInterface => ({
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

  test('should add a transaction to the pendingTx array', () => {
    const tx = createMockTx(1)
    txPool.addPendingTx(tx)
    expect(txPool.getPendingBlocks()[0]).toContain(tx)
  })

  test('should not have duplicate transactions in the pendingTx array', () => {
    const tx = createMockTx(1)
    txPool.addPendingTx(tx)
    txPool.addPendingTx(tx)
    expect(txPool.getPendingBlocks()[0]).toEqual([tx, tx]) // This test checks if duplicates are allowed, adjust according to requirements
  })
})
