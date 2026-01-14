/** @format */

// BlockChains.ts
import { generateTimestampz } from '../lib/generateTimestampz'
import { Block } from '../model/block/block'
import { loggingErr } from '../../logging/errorLog'
import { verifyChainIntegrity } from '../miner/verify/verifyIntegrity'
import { processTransact } from '../transaction/processTransact'
import { verifyMerkleRoot } from '../miner/verify/module/verifyMerkleRoot'
import { contract } from 'interface/front/structContract'
import { saveContracts } from '../../contract/saveContract'
import { removeContractMemPool } from '../savers/mempool/removeContractMempool'
import { createNewBlock } from '../block/createNewBlock'
import { logToConsole } from 'logging/logging'
import { loggingDebug } from 'logging/debug'
import { putAccountCore } from 'nexchain core/savers/account/putAccountCore'
import { saveBlock } from 'nexchain core/savers/block/saveBlock'
import { loadAccountCore } from 'nexchain core/loaders/account/loadAccountCore'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'

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
		transactionsToProcess: TxInterfaceCore[],
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
		transactions: TxInterfaceCore[],
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

	private async giveReward(address: string, reward: bigint): Promise<void> {
		const oldData = await loadAccountCore(address).catch(() => null)
		const oldNexuBalance = oldData?.balance || 0n

		await putAccountCore(address, {
			address,
			balance: oldNexuBalance + reward,
			// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
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
		validTransaction: TxInterfaceCore[],
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
