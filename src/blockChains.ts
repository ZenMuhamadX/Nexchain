/** @format */

// BlockChains.ts
import immutable from 'deep-freeze'
import crypto from 'crypto'
import { TransactionPool } from './Tx/memPool'
import { createGenesisBlock } from './lib/block/createGenesisBlock'
import { generateTimestampz } from './lib/timestamp/generateTimestampz'
import { Block } from './model/blocks/block'
import { saveBlock } from './lib/block/saveBlock'
import { loggingErr } from './logging/errorLog'
import { successLog } from './logging/succesLog'
import { generateSignature } from './lib/hash/generateSIgnature'
import { proofOfWork } from './miner/POW'
import { loadBlocks } from './lib/block/loadBlock'
import { getKeyPair } from './lib/hash/getKeyPair'
import { BSON } from 'bson'
import { calculateSize } from './lib/utils/calculateSize'

export class BlockChains {
	private _chains: Block[]

	constructor() {
		const loadedBlocks = this.loadBlock()
		this._chains = loadedBlocks.length > 0 ? loadedBlocks : this.init()
	}

	private init(): Block[] {
		return [createGenesisBlock()]
	}

	private loadBlock(): Block[] {
		try {
			const loadedBlocks = loadBlocks()
			return Array.isArray(loadedBlocks) ? loadedBlocks : []
		} catch (error) {
			loggingErr({
				error: error as string,
				time: generateTimestampz(),
				hint: 'Error in loadBlock',
				stack: new Error().stack,
			})
			return [] // Return an empty array in case of error
		}
	}

	public addBlockToChain(transaction: TransactionPool): boolean {
		try {
			const newBlock = this.createBlock(transaction.getPendingBlocks())
			saveBlock(newBlock)
			this._chains.push(newBlock)
			successLog({
				hash: newBlock.blk.header.hash,
				height: newBlock.blk.height,
				previousHash: newBlock.blk.header.previousHash,
				signature: newBlock.blk.signature,
				message: 'Block added to the chain',
				timestamp: generateTimestampz(),
				nonce: newBlock.blk.header.nonce,
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
		return this._chains[this._chains.length - 1]
	}

	private createBlock(pendingBlock: any): Block {
		const latestBlock = this.getLatestBlock()
		if (!latestBlock) {
			throw new Error('Latest block is undefined.')
		}
		if (!pendingBlock) {
			throw new Error('Pending Block Not Found')
		}

		const newBlock = new Block(
			this._chains.length,
			generateTimestampz(),
			pendingBlock,
			latestBlock.blk.header.hash,
			'',
			generateSignature(latestBlock.blk.header.hash, getKeyPair().privateKey),
			[],
			'',
			0,
		)
		const proof = proofOfWork({
			height: newBlock.blk.height,
			timestamp: newBlock.blk.header.timestamp,
			transactions: newBlock.blk.transactions,
			previousHash: newBlock.blk.header.previousHash,
			signature: newBlock.blk.signature,
		})
		newBlock.blk.header.hash = proof.hash
		newBlock.blk.header.nonce = proof.nonce
		newBlock.blk.size = calculateSize(newBlock.blk).KB
		return newBlock
	}

	private verifyBlockHash(block: Block): boolean {
		const combinedData = {
			nonce: block.blk.header.nonce,
			height: block.blk.height,
			timestamp: block.blk.header.timestamp,
			transactions: block.blk.transactions,
			previousHash: block.blk.header.previousHash,
			signature: block.blk.signature,
		}

		// Ubah objek menjadi BSON Buffer
		const dataBuffer = BSON.serialize(combinedData)

		const calculatedHash = crypto
			.createHash('sha256')
			.update(dataBuffer)
			.digest('hex')
		return block.blk.header.hash === calculatedHash
	}

	private verifyProofOfWork(block: Block): boolean {
		const difficulty = 4
		const target = '0'.repeat(difficulty)
		return block.blk.header.hash.startsWith(target)
	}

	public verifyBlock(block: Block): boolean {
		return this.verifyBlockHash(block) && this.verifyProofOfWork(block)
	}
}
