// BlockChains.ts
import immutable from 'deep-freeze'
import crypto from 'crypto'
import { TransactionPool } from './Tx/TxPool'
import { createGenesisBlock } from './lib/block/createGenesisBlock'
import { generateTimestampz } from './lib/timestamp/generateTimestampz'
import { Block } from './model/Block'
import { saveBlock } from './lib/block/saveBlock'
import { loggingErr } from './logging/errorLog'
import { successLog } from './logging/succesLog'
import { generateSignature } from './lib/hash/generateSIgnature'
import { proofOfWork } from './miner/POW'
import { BSON } from 'bson'

export class BlockChains {
  private _chains: Block[]

  constructor() {
    this._chains = [createGenesisBlock()]
  }

  public addBlockToChain(transaction: TransactionPool): boolean {
    try {
      const newBlock = this.createBlock(transaction)
      saveBlock(newBlock)
      this._chains.push(newBlock)
      successLog({
        hash: newBlock.hash,
        index: newBlock.index,
        previousHash: newBlock.previousHash,
        signature: newBlock.signature,
        message: 'Block added to the chain',
        timestamp: generateTimestampz(),
        nonce: newBlock.nonce,
      })
      return true
    } catch (error) {
      loggingErr({
        error: error as string,
        time: generateTimestampz(),
        hint: 'Error in addBlockToChain',
        stack: new Error().stack,
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

  private createBlock(pendingBlock: any): Block {
    const latestBlock = this.getLatestBlock()
    if (!latestBlock) {
      loggingErr({
        error: 'Latest block is undefined.',
        time: generateTimestampz(),
        stack: new Error().stack,
      })
      throw new Error('Latest block is undefined.')
    }
    if (!pendingBlock) {
      loggingErr({
        error: 'Pending Block Not Found',
        time: generateTimestampz(),
        stack: new Error().stack,
      })
      throw new Error('Pending Block Not Found')
    }

    const newBlock = new Block(
      this._chains.length,
      generateTimestampz(),
      pendingBlock,
      latestBlock.hash,
      '',
      generateSignature(latestBlock.hash),
      0,
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

  private verifyBlockHash(block: Block): boolean {
    // Hitung hash dari block berdasarkan data block dan nonce
    const combinedData = {
      nonce: block.nonce,
      index: block.index,
      timestamp: block.timestamp,
      transactions: block.getTransactions(),
      previousHash: block.previousHash,
      signature: block.signature,
    }

    // Ubah objek menjadi BSON Buffer
    const dataBuffer = BSON.serialize(combinedData)

    // Hitung hash SHA-256
    const calculatedHash = crypto
      .createHash('sha256')
      .update(dataBuffer)
      .digest('hex')

    // Bandingkan hash yang dihitung dengan hash block
    return block.hash === calculatedHash
  }

  // Verifikasi proof of work
  private verifyProofOfWork(block: Block): boolean {
    // Definisikan tingkat kesulitan (jumlah nol yang diperlukan di awal hash)
    const difficulty = 4
    const target = '0'.repeat(difficulty)

    // Periksa apakah hash block memenuhi kriteria kesulitan
    return block.hash.startsWith(target)
  }

  public verifyBlock(block: Block): boolean {
    // Verifikasi hash block
    const isHashValid = this.verifyBlockHash(block)

    // Verifikasi proof of work
    const isPowValid = this.verifyProofOfWork(block)

    // Kembalikan true jika semua verifikasi berhasil
    return isHashValid && isPowValid
  }
}

const y = new BlockChains()
console.log(y.getChains()[0].getWalletData())
