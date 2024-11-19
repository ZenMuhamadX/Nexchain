/** @format */

// BlockChains.ts
import { generateTimestampz } from './lib/generateTimestampz'
import { Block } from './model/block/block'
import { saveBlock } from './storage/block/saveBlock'
import { loggingErr } from '../logging/errorLog'
import { verifyChainIntegrity } from './miner/verify/verifyIntegrity'
import { TxInterface } from '../interface/structTx'
import { putBalance } from './account/balance/putBalance'
import { getBalance } from './account/balance/getBalance'
import { processTransact } from './transaction/processTransact'

import { verifyMerkleRoot } from './miner/verify/module/verifyMerkleRoot'
import { contract } from 'interface/structContract'
import { saveContracts } from './contract/saveContract'
import { removeContractMemPool } from './storage/mempool/removeContractMempool'
import _ from 'lodash'
import { createNewBlock } from './block/createNewBlock'
import { logToConsole } from 'logging/logging'
import { loggingDebug } from 'logging/debug'
// Manages the blockchain and its operations
export class BlockChains {
	constructor() {
		logToConsole('Chains called...')
		loggingDebug('blockchain:constructor', 'Chains Called...')
	}

	/**
	 * Adds a new block to the blockchain.
	 * @param validTransaction - The memory pool containing transactions to include in the new block.
	 * @param walletMiner - The address of the miner's wallet.
	 * @returns True if the block was added successfully, otherwise false.
	 */
	public async addBlockToChain(
		validTransaction: TxInterface[],
		validContract: contract[],
		walletMiner: string,
	): Promise<{ status: boolean; block: Block | undefined }> {
		try {
			loggingDebug('blockchain:addBlockToChain', 'Create New Block')
			const newBlock = await this.createBlock(
				validTransaction,
				walletMiner,
				validContract,
			)
			loggingDebug('blockchain:addBlockToChain', 'New Block Created', newBlock)
			loggingDebug('blockchain:addBlockToChain', 'validate merkleRoot')
			// Verifikasi Merkle Root sebelum menyimpan blok
			const isValidMerkleRoot = verifyMerkleRoot(
				newBlock.block.transactions,
				newBlock.block.merkleRoot,
			)
			loggingDebug(
				'blockchain:addBlockToChain',
				`merkleRoot valid? ${isValidMerkleRoot} `,
			)
			if (!isValidMerkleRoot) {
				loggingDebug('blockchain:addBlockToChain', 'merkleRoot not valid')
				throw new Error('Merkle root verification failed.')
			}

			loggingDebug('blockchain:addBlockToChain', 'giving reward to miner')
			await this.giveReward(
				newBlock.block.coinbaseTransaction.receiver,
				newBlock.block.totalReward,
			)
			loggingDebug(
				'blockchain:addBlockToChain',
				'reward distributed successfully',
			)
			loggingDebug('blockchain:addBlockToChain', 'saving block to chain')
			try {
				await saveBlock(newBlock) // Simpan blok ke chain
				loggingDebug('blockchain:addBlockToChain', 'block saved successfully')
				loggingDebug(
					'blockchain:addBlockToChain',
					'checking contract deployment',
				)
				if (newBlock.block.contract?.length !== 0) {
					loggingDebug('blockchain:addBlockToChain', 'contract found')
					loggingDebug('blockchain:addBlockToChain', 'deploying contract')
					this.deployContract(validContract)
					_.forEach(newBlock.block.contract, (contract) => {
						removeContractMemPool(contract.contractCodeHash!)
					})
					loggingDebug(
						'blockchain:addBlockToChain',
						'contract deployed successfully',
					)
				}
			} catch (saveError) {
				loggingDebug(
					'blockchain:addBlockToChain',
					'failed to save block',
					saveError,
				)
				throw new Error('Failed to save block: ' + saveError)
			}
			loggingDebug('blockchain:addBlockToChain', 'transaction processed')
			if (validTransaction.length > 0) {
				loggingDebug('blockchain:addBlockToChain', 'processing transaction')
				await processTransact(validTransaction)
				loggingDebug('blockchain:addBlockToChain', 'transaction processed')
			}
			loggingDebug('blockchain:addBlockToChain', 'block added successfully')
			return { block: newBlock, status: true }
		} catch (error) {
			loggingDebug('blockchain:addBlockToChain', 'error adding block', error)
			// Log failure
			loggingErr({
				message: error instanceof Error ? error.message : 'Unknown error',
				context: 'BlockChains',
				level: 'error',
				priority: 'high',
				timestamp: generateTimestampz(),
				hint: 'Error adding block to chain',
				stack: new Error().stack!,
			})
			return {
				block: undefined,
				status: false,
			}
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
		validContract: contract[],
	): Promise<Block> {
		loggingDebug('blockchain:createBlock', 'creating new block')
		return await createNewBlock(transactions, walletMiner, validContract)
	}

	/**
	 * Gives a reward to the miner for creating a new block.
	 * @param address - The address of the miner receiving the reward.
	 * @param reward - The amount of reward to be given.
	 */
	private async giveReward(address: string, reward: number) {
		loggingDebug('blockchain:giveReward', 'checking balance')
		const oldData = await getBalance(address).catch(() => null)
		const oldNexuBalance = oldData?.balance
		loggingDebug('blockchain:giveReward', 'reward given')

		if (!oldNexuBalance) {
			await putBalance(address, {
				address,
				balance: reward,
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
		await putBalance(address, {
			address,
			balance: oldNexuBalance + reward,
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
		loggingDebug('blockchain:verify', 'verifying chain integrity')
		return await verifyChainIntegrity()!
	}

	public async deployContract(contract: contract[]): Promise<void> {
		loggingDebug('blockchain:deployContract', 'deploying contract')
		await saveContracts(contract)
	}
}
