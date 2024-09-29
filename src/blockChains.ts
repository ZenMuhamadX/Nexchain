/** @format */

// BlockChains.ts
import { createGenesisBlock } from './lib/block/createGenesisBlock'
import { generateTimestampz } from './lib/timestamp/generateTimestampz'
import { Block } from './model/blocks/block'
import { saveBlock } from './storage/saveBlock'
import { loggingErr } from './logging/errorLog'
import { successLog } from './logging/succesLog'
import { createSignature } from './lib/block/createSignature'
import { proofOfWork } from './miner/POW'
import { loadBlocks } from './storage/loadBlock'
import { calculateSize } from './lib/utils/calculateSize'
import { verifyChainIntegrity } from './miner/verify/verifyIntegrity'
import { MemPoolInterface } from './model/interface/memPool.inf'
import { saveConfigFile } from './storage/saveConfig'
import { putBalance } from './wallet/balance/putBalance'
import { getBalance } from './wallet/balance/getBalance'
import { structBalance } from './leveldb/struct/structBalance'
import { processTransact } from './transaction/processTransact'

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
				context: 'BlockChains',
				warning: null,
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
			processTransact(validTransaction)
			this._chains.push(newBlock)
			successLog({
				hash: newBlock.block.header.hash,
				height: newBlock.block.height,
				previousHash: newBlock.block.header.previousBlockHash,
				signature: newBlock.block.signature,
				message: 'Block added to the chain',
				timestamp: generateTimestampz().toString(),
				nonce: newBlock.block.header.nonce,
			})
			return true
		} catch (error) {
			loggingErr({
				error: error instanceof Error ? error.message : 'Unknown error',
				context: 'BlockChains',
				warning: null,
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
		return this._chains[this._chains.length - 1] as Block
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
		const newBlock = new Block({
			header: {
				difficulty: 5,
				hash: '',
				nonce: '',
				previousBlockHash: '',
				timestamp: 0,
				version: '1.0.0',
				hashingAlgorithm: 'SHA256',
			},
			gasUsed: 0.001,
			totalTransactionFees: 0,
			height: latestBlock.block.height + 1,
			merkleRoot: '',
			networkId: '',
			signature: '',
			size: 0,
			status: 'confirmed',
			blockReward: 0,
			coinbaseTransaction: {
				amount: 50,
				to: walletMiner,
				reward: 50,
			},
			validator: {
				validationTime: generateTimestampz(),
				stakeAmount: 0,
				rewardAddress: walletMiner,
			},
			metadata: {
				gasPrice: 0,
				txCount: transactions.length,
				created_at: generateTimestampz(),
			},
			transactions: transactions,
		})
		newBlock.block.blockReward =
			newBlock.block.coinbaseTransaction.reward +
			newBlock.block.gasUsed +
			newBlock.block.totalTransactionFees!
		newBlock.block.header.previousBlockHash =
			this._chains[this._chains.length - 1].block.header.hash
		newBlock.block.header.timestamp = generateTimestampz()
		newBlock.block.merkleRoot = ''
		newBlock.block.networkId = ''
		const { hash, nonce } = proofOfWork(newBlock)
		newBlock.block.header.nonce = nonce
		newBlock.block.header.hash = hash
		newBlock.block.size = calculateSize(newBlock).KB
		newBlock.block.signature = createSignature(
			newBlock.block.header.hash,
		).signature
		this.giveReward(walletMiner, newBlock.block.coinbaseTransaction.reward)
		return newBlock
	}

	private async giveReward(address: string, reward: number) {
		const oldBalance: structBalance = (await getBalance(
			address,
		)) as structBalance
		const newBalance = oldBalance.balance + reward
		putBalance(address, {
			address,
			balance: newBalance,
			timesTransaction: oldBalance.timesTransaction + 1,
		})
	}

	/**
	 * Verifies the validity of a given block and the integrity of the blockchain.
	 * @param block - The block to be verified.
	 * @returns True if the block and chain are valid, otherwise false.
	 */
	public verify(): boolean {
		return verifyChainIntegrity()
	}
}
