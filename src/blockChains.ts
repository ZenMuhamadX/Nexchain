/** @format */

// BlockChains.ts
import immutable from 'deep-freeze'
import { createGenesisBlock } from './lib/block/createGenesisBlock'
import { generateTimestampz } from './lib/timestamp/generateTimestampz'
import { Block } from './model/blocks/block'
import { saveBlock } from './lib/block/saveBlock'
import { loggingErr } from './logging/errorLog'
import { successLog } from './logging/succesLog'
import { createSignature } from './lib/block/createSignature'
import { proofOfWork } from './miner/POW'
import { loadBlocks } from './lib/block/loadBlock'
import { calculateSize } from './lib/utils/calculateSize'
import { verifyBlock } from './miner/verify/module/verifyBlock'
import { verifyPow } from './miner/verify/module/verifyPow'
import { verifyChainIntegrity } from './miner/verify/verifyIntegrity'
import { createWalletAddress } from './lib/wallet/createWallet'
import { MemPoolInterface } from './model/interface/memPool.inf'
import { saveConfigFile } from './lib/utils/saveConfig'

// Manages the blockchain and its operations
export class BlockChains {
	private readonly _chains: Block[]

	constructor() {
		saveConfigFile()
		const loadedBlocks = this.loadBlocksFromStorage()
		this._chains =
			loadedBlocks.length > 0 ? loadedBlocks : this.initializeChain()
	}

	/**
	 * Initializes the blockchain with the genesis block.
	 * @returns An array containing the genesis block.
	 */
	private initializeChain(): Block[] {
		return [createGenesisBlock()]
	}

	/**
	 * Loads blocks from storage.
	 * @returns An array of blocks.
	 */
	private loadBlocksFromStorage(): Block[] {
		try {
			const loadedBlocks = loadBlocks()
			return Array.isArray(loadedBlocks) ? loadedBlocks : []
		} catch (error) {
			loggingErr({
				error: error instanceof Error ? error.message : 'Unknown error',
				time: generateTimestampz(),
				hint: 'Error loading blocks from storage',
				stack: new Error().stack,
			})
			return [] // Return an empty array in case of an error
		}
	}

	/**
	 * Adds a new block to the blockchain.
	 * @param memPool - The memory pool containing transactions to include in the new block.
	 * @param walletMiner - The address of the miner's wallet.
	 * @returns True if the block was added successfully, otherwise false.
	 */
	public addBlockToChain(
		validTransaction: MemPoolInterface[],
		walletMiner: string,
	): boolean {
		try {
			const newBlock = this.createBlock(validTransaction, walletMiner)
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
				error: error instanceof Error ? error.message : 'Unknown error',
				time: generateTimestampz(),
				hint: 'Error adding block to chain',
				stack: new Error().stack,
			})
			return false
		}
	}

	/**
	 * Retrieves all blocks in the blockchain.
	 * @returns A read-only array of blocks.
	 */
	public getChains(): ReadonlyArray<Block> {
		return this._chains as ReadonlyArray<Block>
	}

	/**
	 * Retrieves the most recent block in the blockchain.
	 * @returns The latest block.
	 */
	public getLatestBlock(): Block {
		return this._chains[this._chains.length - 1]
	}

	/**
	 * Retrieves the most recent block in the blockchain.
	 * @returns The latest block.
	 */
	public getLatestBlockJSON(): string {
		return immutable(JSON.stringify(this._chains[this._chains.length - 1]))
	}

	/**
	 * Creates a new block using the provided transactions and miner's wallet address.
	 * @param transactions - The list of transactions to include in the new block.
	 * @param walletMiner - The address of the miner's wallet.
	 * @returns The newly created block.
	 */
	private createBlock(
		transactions: MemPoolInterface[],
		walletMiner: string,
	): Block {
		const latestBlock = this.getLatestBlock()
		if (!latestBlock) {
			throw new Error('Latest block is undefined.')
		}
		if (!transactions || transactions.length === 0) {
			throw new Error('No transactions provided for the new block.')
		}

		const newBlock = new Block(
			this._chains.length,
			generateTimestampz(),
			[
				{
					amount: latestBlock.blk.reward,
					from: 'NexChain',
					to: walletMiner,
					signature: createSignature(createWalletAddress()).signature,
					timestamp: generateTimestampz(),
					fee: 0,
					message: 'Reward Miner',
					status: 'confirmed',
				},
				...transactions,
			],
			latestBlock.blk.header.hash,
			'',
			createSignature(latestBlock.blk.header.hash).signature,
			[],
			'',
			'',
		)
		const proof = proofOfWork(newBlock)
		newBlock.blk.header.hash = proof.hash
		newBlock.blk.header.nonce = proof.nonce
		newBlock.blk.size = calculateSize(newBlock.blk).KB
		return newBlock
	}

	/**
	 * Verifies the validity of a given block and the integrity of the blockchain.
	 * @param block - The block to be verified.
	 * @returns True if the block and chain are valid, otherwise false.
	 */
	public verify(block: Block): boolean {
		return (
			verifyChainIntegrity() &&
			verifyBlock(block, block.blk.header.nonce, block.blk.header.hash) &&
			verifyPow(block)
		)
	}
}
const x = new BlockChains()
console.log(x.getLatestBlockJSON())
