/** @format */

// BlockChains.ts
import { generateTimestampz } from '../lib/generateTimestampz'
import { Block } from '../model/block/block'
import { saveBlock } from '../storage/block/saveBlock'
import { loggingErr } from '../../logging/errorLog'
import { verifyChainIntegrity } from '../miner/verify/verifyIntegrity'
import { TxInterface } from '../../interface/structTx'
import { processTransact } from '../transaction/processTransact'

import { verifyMerkleRoot } from '../miner/verify/module/verifyMerkleRoot'
import { contract } from 'interface/structContract'
import { saveContracts } from '../../contract/saveContract'
import { removeContractMemPool } from '../storage/mempool/removeContractMempool'
import _ from 'lodash'
import { createNewBlock } from '../block/createNewBlock'
import { logToConsole } from 'logging/logging'
import { loggingDebug } from 'logging/debug'
import { putAccount } from 'account/balance/putAccount'
import { getAccount } from 'account/balance/getAccount'

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
		transactionsToProcess: TxInterface[],
		contractsToDeploy: contract[],
		minerAddress: string,
	): Promise<{ status: boolean; block: Block | undefined }> {
		try {
			const newBlock = await this.createBlock(
				transactionsToProcess,
				minerAddress,
				contractsToDeploy,
			)
			const isMerkleRootValid = await this.verifyMerkleRoot(newBlock)
			if (!isMerkleRootValid) {
				throw new Error('Merkle root verification failed.')
			}

			await this.giveReward(
				newBlock.block.coinbaseTransaction.receiver,
				newBlock.block.totalReward,
			)

			await this.saveBlockToChain(newBlock)
			if (newBlock.block.contract?.length !== 0) {
				await this.deployContractAndRemoveFromMemPool(
					contractsToDeploy,
					newBlock,
				)
			}

			if (transactionsToProcess.length > 0) {
				await this.processTransactions(transactionsToProcess)
			}

			return { block: newBlock, status: true }
		} catch (error) {
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

	private async createBlock(
		transactions: TxInterface[],
		walletMiner: string,
		validContract: contract[],
	): Promise<Block> {
		loggingDebug('blockchain:createBlock', 'creating new block')
		return await createNewBlock(transactions, walletMiner, validContract)
	}

	private async verifyMerkleRoot(newBlock: Block): Promise<boolean> {
		loggingDebug('blockchain:verifyMerkleRoot', 'validating Merkle root')
		return verifyMerkleRoot(
			newBlock.block.transactions,
			newBlock.block.merkleRoot,
		)
	}

	private async giveReward(address: string, reward: number): Promise<void> {
		const oldData = await getAccount(address).catch(() => null)
		const oldNexuBalance = oldData?.balance || 0

		await putAccount(address, {
			address,
			balance: oldNexuBalance + reward,
			transactionCount: oldData?.transactionCount! + 1 || 0,
			isContract: false,
			lastTransactionDate: generateTimestampz(),
			nonce: 0,
		})
		loggingDebug('blockchain:giveReward', 'reward distributed successfully')
	}

	private async saveBlockToChain(newBlock: Block): Promise<void> {
		try {
			loggingDebug('blockchain:saveBlockToChain', 'saving block to chain')
			await saveBlock(newBlock)
			loggingDebug('blockchain:saveBlockToChain', 'block saved successfully')
		} catch (saveError) {
			loggingErr({
				message:
					saveError instanceof Error ? saveError.message : 'Unknown error',
				context: 'BlockChains',
				level: 'error',
				priority: 'high',
				timestamp: generateTimestampz(),
				hint: 'Error saving block to chain',
				stack: new Error().stack || '',
			})
			throw new Error('Failed to save block: ' + saveError)
		}
	}

	private async deployContractAndRemoveFromMemPool(
		validContract: contract[],
		newBlock: Block,
	): Promise<void> {
		loggingDebug(
			'blockchain:deployContractAndRemoveFromMemPool',
			'deploying contract',
		)
		await this.deployContract(validContract)
		newBlock.block.contract?.forEach((contract) => {
			removeContractMemPool(contract.contractCodeHash!)
		})
		loggingDebug(
			'blockchain:deployContractAndRemoveFromMemPool',
			'contract deployed successfully',
		)
	}

	private async processTransactions(
		validTransaction: TxInterface[],
	): Promise<void> {
		loggingDebug('blockchain:processTransactions', 'processing transactions')
		await processTransact(validTransaction)
		loggingDebug('blockchain:processTransactions', 'transactions processed')
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
