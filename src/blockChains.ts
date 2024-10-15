/** @format */

// BlockChains.ts
import { generateTimestampz } from './lib/timestamp/generateTimestampz'
import { Block } from './model/blocks/block'
import { saveBlock } from './storage/block/saveBlock'
import { loggingErr } from './logging/errorLog'
import { successLog } from './logging/succesLog'
import { createSignature } from './lib/block/createSignature'
import { proofOfWork } from './miner/POW'
import { calculateSize } from './lib/utils/calculateSize'
import { verifyChainIntegrity } from './miner/verify/verifyIntegrity'
import { txInterface } from './model/interface/memPool.inf'
import { saveConfigFile } from './storage/conf/saveConfig'
import { putBalance } from './wallet/balance/putBalance'
import { getBalance } from './wallet/balance/getBalance'
import { structBalance } from './transaction/struct/structBalance'
import { processTransact } from './transaction/processTransact'
import { calculateTotalFees } from './transaction/utils/totalFees'
import { calculateTotalBlockReward } from './miner/calculateReward'
import { calculateMerkleRoot } from './transaction/utils/createMerkleRoot'
import { getLatestBlock } from './block/query/direct/block/getLatestBlock'
import { getAllBlock } from './block/query/direct/block/getAllBlock'
import { getNetworkId } from './Network/utils/getNetId'
import { getKeyPair } from './lib/hash/getKeyPair'

// Manages the blockchain and its operations
export class BlockChains {
	constructor() {
		// Initialize the configuration file and load existing blocks.
		saveConfigFile()
	}

	/**
	 * Adds a new block to the blockchain.
	 * @param validTransaction - The memory pool containing transactions to include in the new block.
	 * @param walletMiner - The address of the miner's wallet.
	 * @returns True if the block was added successfully, otherwise false.
	 */
	public async addBlockToChain(
		validTransaction: txInterface[],
		walletMiner: string,
	): Promise<boolean> {
		try {
			// Create a new block and process the transactions.
			const newBlock = await this.createBlock(validTransaction, walletMiner)
			await this.giveReward(walletMiner, newBlock.block.blockReward)
			saveBlock(newBlock)
			processTransact(validTransaction, newBlock)
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
	 * Creates a new block using the provided transactions and miner's wallet address.
	 * @param transactions - The list of transactions to include in the new block.
	 * @param walletMiner - The address of the miner's wallet.
	 * @returns The newly created block.
	 */
	private async createBlock(
		transactions: txInterface[],
		walletMiner: string,
	): Promise<Block> {
		const allBlock = await getAllBlock()
		const currentBlockHeight = allBlock.length - 1
		const latestBlock = (await getLatestBlock()) as Block
		const { privateKey } = getKeyPair()

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
			blockReward: 50,
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
			allBlock[allBlock.length - 1].block.header.hash

		newBlock.block.header.timestamp = generateTimestampz()

		// Perform proof of work and finalize the new block.
		const { hash, nonce } = proofOfWork(newBlock)
		newBlock.block.header.nonce = nonce
		newBlock.block.header.hash = hash
		newBlock.block.size = calculateSize(newBlock).KB

		newBlock.block.signature = createSignature(
			newBlock.block.header.hash,
			privateKey,
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
	public async verify(): Promise<boolean> {
		return await verifyChainIntegrity()!
	}
}
