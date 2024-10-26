/** @format */

// BlockChains.ts
import { generateTimestampz } from './lib/generateTimestampz'
import { Block } from './model/block/block'
import { saveBlock } from './storage/block/saveBlock'
import { loggingErr } from '../logging/errorLog'
import { successLog } from '../logging/succesLog'
import { createSignature } from './sign/createSignature'
import { proofOfWork } from './miner/Pow'
import { calculateSize } from './lib/calculateSize'
import { verifyChainIntegrity } from './miner/verify/verifyIntegrity'
import { TxInterface } from '../interface/structTx'
import { putBalance } from './account/balance/putBalance'
import { getBalance } from './account/balance/getBalance'
import { processTransact } from './transaction/processTransact'
import { calculateTotalFees } from './transaction/utils/totalFees'
import { calculateTotalBlockReward } from './miner/calculateReward'
import { getCurrentBlock } from './block/query/direct/block/getCurrentBlock'
import { loadWallet } from './account/utils/loadWallet'
import { stringToHex } from './hex/stringToHex'
import { toNexu } from './nexucoin/toNexu'
import { createMerkleRoot } from './transaction/utils/createMerkleRoot'
import { verifyMerkleRoot } from './miner/verify/module/verifyMerkleRoot'
import { setBlockReward } from './block/dynamicReward'
import { getMinerId } from 'Network(Development)/utils/getMinerId'

// Manages the blockchain and its operations
export class BlockChains {
	constructor() {
		console.log('Chains called.')
	}

	/**
	 * Adds a new block to the blockchain.
	 * @param validTransaction - The memory pool containing transactions to include in the new block.
	 * @param walletMiner - The address of the miner's wallet.
	 * @returns True if the block was added successfully, otherwise false.
	 */
	public async addBlockToChain(
		validTransaction: TxInterface[],
		walletMiner: string,
	): Promise<boolean> {
		try {
			const newBlock = await this.createBlock(validTransaction, walletMiner)

			// Verifikasi Merkle Root sebelum menyimpan blok
			const isValidMerkleRoot = verifyMerkleRoot(
				newBlock.block.transactions,
				newBlock.block.merkleRoot,
			)
			if (!isValidMerkleRoot) {
				throw new Error('Merkle root verification failed.')
			}

			await this.giveReward(
				newBlock.block.coinbaseTransaction.receiver,
				newBlock.block.totalReward,
			)

			try {
				saveBlock(newBlock) // Simpan blok ke chain
			} catch (saveError) {
				throw new Error('Failed to save block: ' + saveError)
			}

			if (validTransaction.length > 0) {
				await processTransact(validTransaction)
			}

			// Log success
			successLog({
				hash: newBlock.block.header.hash,
				height: newBlock.block.height,
				previousHash: newBlock.block.header.previousBlockHash,
				message: 'Block added to the chain',
				timestamp: generateTimestampz().toString(),
				nonce: newBlock.block.header.nonce,
			})

			return true
		} catch (error) {
			// Log failure
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
		transactions: TxInterface[],
		walletMiner: string,
	): Promise<Block> {
		const latestBlock: Block = await getCurrentBlock()
		const currentHeight = latestBlock.block.height
		const { privateKey } = loadWallet()!

		if (!latestBlock) {
			throw new Error('Latest block is undefined.')
		}

		// Create a new block with specified parameters.
		const newBlock = new Block({
			header: {
				difficulty: 5,
				hash: '',
				nonce: 0,
				previousBlockHash: '',
				timestamp: generateTimestampz(),
				version: '1.0.0',
				hashingAlgorithm: 'SHA256',
			},
			totalTransactionFees: 0,
			height: currentHeight + 1,
			merkleRoot: createMerkleRoot(transactions),
			minerId: getMinerId(),
			size: 0,
			sign: {
				r: '',
				s: '',
				v: 0,
			},
			status: 'confirmed',
			blockReward: 0,
			totalReward: 0,
			coinbaseTransaction: {
				amount: 0,
				receiver: walletMiner,
				extraData: stringToHex('Block reward'),
			},
			metadata: {
				extraData: stringToHex('BlockChains by NexChain'),
				gasPrice: 0.00002678,
				txCount: transactions.length,
				created_at: generateTimestampz(),
			},
			transactions: transactions,
		})

		newBlock.block.blockReward = setBlockReward(newBlock.block.height)

		// Calculate fees and rewards for the new block.
		newBlock.block.totalTransactionFees = calculateTotalFees(
			newBlock.block.transactions,
		)

		newBlock.block.totalReward = calculateTotalBlockReward(
			newBlock.block.blockReward,
			newBlock.block.metadata?.gasPrice!,
			newBlock.block.totalTransactionFees,
		)

		newBlock.block.coinbaseTransaction.amount = newBlock.block.totalReward

		newBlock.block.header.previousBlockHash = latestBlock.block.header.hash

		// Perform proof of work and finalize the new block.
		const { hash, nonce } = proofOfWork(newBlock)
		newBlock.block.header.nonce = nonce
		newBlock.block.header.hash = hash
		newBlock.block.size = calculateSize(newBlock).KB

		newBlock.block.sign = createSignature(
			newBlock.block.header.hash,
			privateKey,
		)

		return newBlock
	}

	/**
	 * Gives a reward to the miner for creating a new block.
	 * @param address - The address of the miner receiving the reward.
	 * @param reward - The amount of reward to be given.
	 */
	private async giveReward(address: string, reward: number) {
		const oldData = await getBalance(address).catch(() => null)
		const nexuReward = toNexu(reward)
		const oldNexuBalance = oldData?.balance

		if (!oldNexuBalance) {
			putBalance(address, {
				address,
				balance: toNexu(reward),
				timesTransaction: 0,
				isContract: false,
				lastTransactionDate: null,
				nonce: 0,
				decimal: 18,
				notes: '1^18 nexu = 1 NXC',
				symbol: 'nexu',
			})
			return
		}
		putBalance(address, {
			address,
			balance: oldNexuBalance + nexuReward,
			timesTransaction: oldData.timesTransaction + 1,
			isContract: false,
			lastTransactionDate: generateTimestampz(),
			nonce: 0,
			decimal: 18,
			notes: '1^18 nexu = 1 NXC',
			symbol: 'nexu',
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
