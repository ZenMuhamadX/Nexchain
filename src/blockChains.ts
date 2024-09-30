/** @format */

// BlockChains.ts
import { createGenesisBlock } from './block/createGenesisBlock'
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
import { structBalance } from './transaction/struct/structBalance'
import { processTransact } from './transaction/processTransact'
import { calculateTotalFees } from './transaction/totalFees'
import { calculateTotalBlockReward } from './miner/calculateReward'
import { calculateMerkleRoot } from './transaction/merkleRoot'
import { getNetworkId } from './network/lib/getNetId'
import { saveHistory } from './wallet/utils/saveYourTransact'

// Manages the blockchain and its operations
export class BlockChains {
	private readonly _chains: Block[]

	constructor() {
		// Initialize the configuration file and load existing blocks.
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
			// Log the error if loading fails and return an empty array.
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
	 * @param validTransaction - The memory pool containing transactions to include in the new block.
	 * @param walletMiner - The address of the miner's wallet.
	 * @returns True if the block was added successfully, otherwise false.
	 */
	public async addBlockToChain(
		validTransaction: MemPoolInterface[],
		walletMiner: string,
	): Promise<boolean> {
		try {
			// Create a new block and process the transactions.
			const newBlock = this.createBlock(validTransaction, walletMiner)
			await this.giveReward(walletMiner, newBlock.block.blockReward)
			saveBlock(newBlock)
			processTransact(validTransaction)
			this._chains.push(newBlock)
			saveHistory()
			// Log the success of adding the block.
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
			// Log the error if adding the block fails.
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
		const currentBlockHeight = this._chains.length
		const latestBlock = this.getLatestBlock()

		if (!latestBlock) {
			throw new Error('Latest block is undefined.')
		}

		if (!transactions || transactions.length === 0) {
			throw new Error('No transactions provided for the new block.')
		}

		// Create a new block with specified parameters.
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
			totalTransactionFees: 0,
			height: currentBlockHeight + 1,
			merkleRoot: calculateMerkleRoot(transactions),
			networkId: getNetworkId(),
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
				notes: `BlockChains by NexChain`,
				gasPrice: ((50 / 500) * 2) / 5,
				txCount: transactions.length,
				created_at: generateTimestampz(),
			},
			transactions: transactions,
		})

		// Calculate fees and rewards for the new block.
		newBlock.block.totalTransactionFees = calculateTotalFees(
			newBlock.block.transactions,
		)

		newBlock.block.blockReward = calculateTotalBlockReward(
			newBlock.block.blockReward,
			newBlock.block.metadata?.gasPrice!,
			newBlock.block.totalTransactionFees,
		)

		newBlock.block.header.previousBlockHash =
			this._chains[this._chains.length - 1].block.header.hash

		newBlock.block.header.timestamp = generateTimestampz()

		// Perform proof of work and finalize the new block.
		const { hash, nonce } = proofOfWork(newBlock)
		newBlock.block.header.nonce = nonce
		newBlock.block.header.hash = hash
		newBlock.block.size = calculateSize(newBlock).KB

		newBlock.block.signature = createSignature(
			newBlock.block.header.hash,
		).signature

		return newBlock
	}

	/**
	 * Gives a reward to the miner for creating a new block.
	 * @param address - The address of the miner receiving the reward.
	 * @param reward - The amount of reward to be given.
	 */
	private async giveReward(address: string, reward: number) {
		const oldBalance = (await getBalance(address)) as structBalance
		const newBalance = oldBalance.balance + reward

		putBalance(address, {
			address,
			balance: newBalance,
			timesTransaction: oldBalance.timesTransaction + 1,
		})
	}

	/**
	 * Verifies the validity of a given block and the integrity of the blockchain.
	 * @returns True if the block and chain are valid, otherwise false.
	 */
	public verify(): boolean {
		return verifyChainIntegrity()
	}
}
