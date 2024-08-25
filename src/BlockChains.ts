// BlockChains.ts
import immutable from 'deep-freeze'
import { TxPool } from './Tx/TxPool'
import { createGenesisBlock } from './lib/createGenesisBlock'
import { generateTimestampz } from './lib/generateTimestampz'
import { Block } from './model/Block'
import { generateBlockHash } from './lib/generateHash'
import { TxBlock, TxInterface } from './model/TxBlock'

export class BlockChains {
  private _chains: Block[]

  constructor() {
    this._chains = [createGenesisBlock()]
  }

  public addTxToBlock(tx: TxPool) {
    const newBlock = this.createBlock(tx)
    this._chains.push(newBlock)
    return newBlock
  }

  public getChains(): ReadonlyArray<Block> {
    return immutable(this._chains) as ReadonlyArray<Block>
  }

  public getLatestBlock(): Block | undefined {
    const latestBlock = this._chains[this._chains.length - 1]
    return latestBlock ? (immutable(latestBlock) as Block) : undefined
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
    if (!latestBlock) {
      throw new Error('Latest block is undefined.')
    }
    const TxBlock = tx.getBlockTx()
    if (!TxBlock.length) {
      throw new Error('Pending Block Not Found')
    }

    const newBlock = new Block(
      this._chains.length,
      generateTimestampz(),
      TxBlock,
      latestBlock.hash
    )
    return newBlock
  }

  private isHashValid(currentBlock: Block): boolean {
    const calculatedHash = generateBlockHash(
      currentBlock.index,
      currentBlock.timestamp,
      currentBlock.getTransactions(),
      currentBlock.previousHash
    )
    return currentBlock.hash === calculatedHash
  }

  private isPreviousHashValid(
    currentBlock: Block,
    previousBlock: Block
  ): boolean {
    return currentBlock.previousHash === previousBlock.hash
  }

  private isIndexValid(currentBlock: Block, previousBlock: Block): boolean {
    return currentBlock.index === previousBlock.index + 1
  }
}
