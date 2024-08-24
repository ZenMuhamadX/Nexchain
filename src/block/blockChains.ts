import { TxPool } from '../Tx/TxPool'
import { createGenesisBlock } from '../lib/createGenesisBlock'
import { generateBlockHash } from '../lib/generateHash'
import { generateTimestampz } from '../lib/generateTimestampz'
import { block } from './block'

export class BlockChains {
  private _chains: block[] // Menyatakan bahwa chains adalah array dari block

  constructor() {
    this._chains = [createGenesisBlock()]
  }

  public addTxToBlock(tx: TxPool): void {
    let newBlock: block = new block(
      this._chains.length,
      generateTimestampz(),
      tx.getPendingTx(),
      this.getLatestBlock().hash
    )
    this._chains.push(newBlock)
    tx.clear()
  }

  public getChains(): block[] {
    return this._chains
  }

  public getLatestBlock(): block {
    // Memperbaiki metode untuk mengembalikan block
    return this._chains[this._chains.length - 1]
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this._chains.length; i++) {
      const currentBlock = this._chains[i]
      const previousBlock = this._chains[i - 1]

      // Validasi Hash
      const calculatedHash = generateBlockHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.getTransactions(),
        currentBlock.previousHash
      )
      if (currentBlock.hash !== calculatedHash) {
        console.log(
          `Invalid hash at block ${currentBlock.index}. Expected ${calculatedHash}, got ${currentBlock.hash}`
        )
        return false
      }

      // Validasi Keterhubungan Blok
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log(
          `Invalid previousHash at block ${currentBlock.index}. Expected ${previousBlock.hash}, got ${currentBlock.previousHash}`
        )
        return false
      }

      // Validasi Indeks
      if (currentBlock.index !== previousBlock.index + 1) {
        console.log(
          `Invalid index at block ${currentBlock.index}. Expected ${
            previousBlock.index + 1
          }, got ${currentBlock.index}`
        )
        return false
      }
    }
    return true
  }
}
