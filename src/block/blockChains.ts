import { TxPool } from '../Tx/TxPool'
import { createGenesisBlock } from '../lib/createGenesisBlock'
import { generateBlockHash } from '../lib/generateHash'
import { generateTimestampz } from '../lib/generateTimestampz'
import { block } from './block'

export class BlockChains {
  private chains: block[] // Menyatakan bahwa chains adalah array dari block

  constructor() {
    this.chains = [createGenesisBlock()]
  }

  public getChains(): block[] {
    return this.chains
  }

  public addTxToBlock(tx: TxPool): void {
    let newBlock: block = new block(
      this.chains.length,
      generateTimestampz(),
      tx.getPendingTx(),
      this.getLastBlock().hash
    )
    newBlock.hash = generateBlockHash(
      newBlock.index,
      newBlock.timestamp,
      newBlock.transactions,
      newBlock.previousHash
    )
    this.chains.push(newBlock)
    tx.clear()
  }

  public getLastBlock(): block {
    // Memperbaiki metode untuk mengembalikan block
    return this.chains[this.chains.length - 1]
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this.chains.length; i++) {
      const currentBlock = this.chains[i]
      const previousBlock = this.chains[i - 1]

      // Validasi Hash
      const calculatedHash = generateBlockHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.transactions, // Periksa nama property jika berbeda
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
