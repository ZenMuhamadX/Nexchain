import { transactionValidator } from 'interface/validate/txValidator.v'
import { saveTxHistory } from 'nexchain/transaction/saveTxHistory'
import { TxInterface } from 'interface/structTx'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { contract } from 'interface/structContract'
import { isContract } from 'nexchain/lib/isContract'
import { logToConsole } from 'logging/logging'
import { ManageContract } from 'nexchain/contract/manageContract'
import { saveMempool } from 'nexchain/storage/mempool/saveMemPool'
import { getPendingBalance } from 'nexchain/transaction/getPendingBalance'
import { setPendingBalance } from 'nexchain/transaction/setPendingBalance'
import { saveContractMempool } from 'nexchain/storage/mempool/saveContractMempool'
import { loadContractMempool } from 'nexchain/storage/mempool/loadContractMempool'
import { loadMempool } from 'nexchain/storage/mempool/loadMempool'

export class MemPool {
	constructor() {
		logToConsole('MemPool initialized...')
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully, otherwise false.
	 */
	public async addTransaction(
		transaction: TxInterface,
	): Promise<boolean | TxInterface> {
		const isValidTx = await transactionValidator(transaction)
		if (!isValidTx) {
			logToConsole('Transaction validation failed')
			return false
		}

		const isSenderContract = isContract(transaction.sender)

		// Validate balance and update pending balance
		const isBalanceSufficient = isSenderContract
			? await this.handleContractTransaction(transaction)
			: await this.handleUserTransaction(transaction)

		if (!isBalanceSufficient) return false

		// Save transaction to mempool and history
		await saveMempool(transaction)
		await saveTxHistory(transaction.txHash!, transaction)
		logToConsole(`Transaction added. TxnHash: ${transaction.txHash}`)

		return transaction
	}

	/**
	 * Validates and updates pending balance for contract transactions.
	 * @param transaction - Contract transaction.
	 * @returns True if balance is sufficient, otherwise false.
	 */
	private async handleContractTransaction(
		transaction: TxInterface,
	): Promise<boolean> {
		const contractManager = new ManageContract(transaction.sender)
		const contractBalance = await contractManager.getContractBalance()
		const pendingBalance = await getPendingBalance(transaction.sender)

		const availableBalance =
			contractBalance - (pendingBalance.pendingAmount || 0)
		if (availableBalance < transaction.amount + (transaction.fee || 0)) {
			logToConsole('Insufficient contract balance for the transaction')
			return false
		}

		// Update pending balance
		await this.updatePendingBalance(
			transaction.sender,
			pendingBalance.pendingAmount,
			transaction,
		)
		return true
	}

	/**
	 * Validates and updates pending balance for user transactions.
	 * @param transaction - User transaction.
	 * @returns True if balance is sufficient, otherwise false.
	 */
	private async handleUserTransaction(
		transaction: TxInterface,
	): Promise<boolean> {
		const userBalance = await getBalance(transaction.sender)
		if (!userBalance) {
			logToConsole('Insufficient user balance')
			return false
		}

		const pendingBalance = await getPendingBalance(transaction.sender)
		const availableBalance =
			userBalance.balance - (pendingBalance.pendingAmount || 0)

		if (availableBalance < transaction.amount + (transaction.fee || 0)) {
			logToConsole('Insufficient user balance for the transaction')
			return false
		}

		// Update pending balance
		await this.updatePendingBalance(
			transaction.sender,
			pendingBalance.pendingAmount,
			transaction,
		)
		return true
	}

	/**
	 * Updates the pending balance for a given address.
	 * @param address - The address to update.
	 * @param currentPending - The current pending balance.
	 * @param transaction - The transaction to update with.
	 */
	private async updatePendingBalance(
		address: string,
		currentPending: number | undefined,
		transaction: TxInterface,
	): Promise<void> {
		const newPendingAmount =
			(currentPending || 0) + transaction.amount + (transaction.fee || 0)
		await setPendingBalance({ address, pendingAmount: newPendingAmount })
	}

	/**
	 * Adds a contract to the contract memory pool.
	 * @param contract - The contract to add.
	 */
	public async addContract(contract: contract): Promise<void> {
		if (!isContract(contract.contractAddress)) {
			logToConsole('Invalid contract address')
			return
		}
		await saveContractMempool(contract)
	}

	/**
	 * Retrieves all contracts in the memory pool.
	 * @returns An array of contracts.
	 */
	public async getContractPool(): Promise<contract[]> {
		return await loadContractMempool()
	}

	/**
	 * Retrieves all valid transactions in the memory pool.
	 * @returns An array of transactions.
	 */
	public async getValidTransactions(): Promise<TxInterface[]> {
		return (await loadMempool()) as TxInterface[]
	}
}
