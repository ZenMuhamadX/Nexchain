// BlockChains.ts
import immutable from 'deep-freeze'
import { TransactionPool } from './Tx/TxPool'
import { createGenesisBlock } from './lib/createGenesisBlock'
import { generateTimestampz } from './lib/generateTimestampz'
import { Block } from './model/Block'
import { generateBlockHash } from './lib/generateHash'
import { saveBlock } from './lib/writeBlock'
import { loggingErr } from './logging/errorLog'
import { succesLog } from './logging/succesLog'
import { generateSignature } from './lib/generateSIgnature'
import { proofOfWork} from './miner/POW'

export class BlockChains {
  private _chains: Block[]

  constructor() {
    this._chains = [createGenesisBlock()]
  }

  public addBlockToChain(transaction: TransactionPool) {
    try {
      const newBlock = this.createBlock(transaction)
      saveBlock(newBlock)
      this._chains.push(newBlock)
      succesLog({
        hash: newBlock.hash,
        index: newBlock.index,
        previousHash: newBlock.previousHash,
        signature: newBlock.signature,
        message: 'Block added to the chain',
        timestamp: generateTimestampz(),
        nonce: newBlock.nonce,
      })
    } catch (error) {
      loggingErr({
        error: error as string,
        time: generateTimestampz(),
        hint: 'Error in addBlockToChain',
      })
      throw error
    }
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

  private createBlock(tx: TransactionPool): Block {
    const latestBlock = this.getLatestBlock()
    if (!latestBlock) {
      loggingErr({
        error: 'Latest block is undefined.',
        time: generateTimestampz(),
      })
      throw new Error('Latest block is undefined.')
    }
    const TxBlock = tx.getPendingBlocks()
    if (!TxBlock.length) {
      loggingErr({
        error: 'Pending Block Not Found',
        time: generateTimestampz(),
      })
      throw new Error('Pending Block Not Found')
    }

    const newBlock = new Block(
      this._chains.length,
      generateTimestampz(),
      TxBlock,
      latestBlock.hash,
      '',
      generateSignature(latestBlock.hash),
      0
    )
    newBlock.hash = proofOfWork({
      index: newBlock.index,
      timestamp: newBlock.timestamp,
      transactions: newBlock.getTransactions(),
      previousHash: newBlock.previousHash,
      signature: newBlock.signature,
    }).hash
    newBlock.nonce = proofOfWork({
      index: newBlock.index,
      timestamp: newBlock.timestamp,
      transactions: newBlock.getTransactions(),
      previousHash: newBlock.previousHash,
      signature: newBlock.signature,
    }).nonce
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
