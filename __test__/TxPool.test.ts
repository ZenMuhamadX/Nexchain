// __tests__/TxPool.test.ts
import { TxPool } from '../src/Tx/TxPool'

describe('TxPool', () => {
  let txPool: TxPool

  beforeEach(() => {
    txPool = new TxPool()
  })

  test('should initialize with empty transaction pool', () => {
    expect(txPool.getPendingTx()).toEqual([])
  })

  test('should clear transactions', () => {
    // Mock adding a transaction
    ;(txPool.getPendingTx as jest.Mock).mockReturnValue([
      { id: 1, amount: 100 },
    ])
    txPool.clear()
    expect(txPool.getPendingTx()).toEqual([])
  })
})
