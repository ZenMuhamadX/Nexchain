// BlockChains.ts
import { TxInterface } from './model/Tx'
import { TxPool } from './Tx/TxPool'
import { createGenesisBlock } from './lib/createGenesisBlock'
import { generateBlockHash } from './lib/generateHash'
import { generateTimestampz } from './lib/generateTimestampz'
import { Block } from './model/Block'

interface ChainDetails {
  index: number
  timestamp: string
  transactions: TxInterface[]
  previousHash: string
  hash: string
}

export class BlockChains {
  private _chains: Block[]

  constructor() {
    this._chains = [createGenesisBlock()]
  }

  public addTxToBlock(tx: TxPool): void {
    const newBlock = this.createBlock(tx)
    this._chains.push(newBlock)
    tx.clear()
  }

  public getChains(): ChainDetails[] {
    return this._chains
  }

  public getLatestBlock(): Block {
    return this._chains[this._chains.length - 1]
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this._chains.length; i++) {
      const currentBlock = this._chains[i]
      const previousBlock = this._chains[i - 1]

      if (
        !this.isHashValid(currentBlock) ||
        !this.isPreviousHashValid(currentBlock, previousBlock) ||
        !this.isIndexValid(currentBlock, previousBlock)
      ) {
        return false
      }
    }
    return true
  }

  private createBlock(tx: TxPool): Block {
    const latestBlock = this.getLatestBlock()
    return new Block(
      this._chains.length,
      generateTimestampz(),
      tx.getPendingTx(),
      latestBlock.hash
    )
  }

  private isHashValid(currentBlock: Block): boolean {
    const calculatedHash = generateBlockHash(
      currentBlock.index,
      currentBlock.timestamp,
      currentBlock.getTransactions(),
      currentBlock.previousHash
    )
    if (currentBlock.hash !== calculatedHash) {
      return false
    }
    return true
  }

  private isPreviousHashValid(
    currentBlock: Block,
    previousBlock: Block
  ): boolean {
    if (currentBlock.previousHash !== previousBlock.hash) {
      return false
    }
    return true
  }

  private isIndexValid(currentBlock: Block, previousBlock: Block): boolean {
    if (currentBlock.index !== previousBlock.index + 1) {
      return false
    }
    return true
  }
}
