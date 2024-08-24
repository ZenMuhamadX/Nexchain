// __tests__/generateHash.test.ts
import { TxInterface } from './../src/model/Tx'
import { generateBlockHash } from '../src/lib/generateHash'
import crypto from 'node:crypto'

describe('generateBlockHash', () => {
  test('should generate a hash for the block', () => {
    const index = 1
    const timestamp = '2024-01-02T00:00:00Z'
    const Tx: TxInterface[] = []
    const previousHash = '0'
    const hash = generateBlockHash(index, timestamp, Tx, previousHash)
    const hashResult = crypto
      .createHash('sha256')
      .update(`${index}-${timestamp}-${Tx}-${previousHash}`)
      .digest('hex')
    expect(hash).toBe(hashResult)
  })
})
