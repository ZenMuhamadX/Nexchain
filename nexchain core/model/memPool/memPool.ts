import { transactionValidator } from 'interface/validation/txValidator.v'
import { saveTxHistory } from 'nexchain core/transaction/saveTxHistory'
import { contract } from 'interface/front/structContract'
import { isContract } from 'nexchain core/lib/isContract'
import { logToConsole } from 'logging/logging'
import { ManageContract } from 'contract/manageContract'
import { saveMempool } from 'nexchain core/savers/mempool/saveMemPool'
import { getPendingBalance } from 'nexchain core/transaction/getPendingBalance'
import { setPendingBalance } from 'nexchain core/savers/transaction/setPendingBalance'
import { saveContractMempool } from 'nexchain core/savers/mempool/saveContractMempool'
import { loadContractMempool } from 'nexchain core/loaders/contract/loadContractMempool'
import { loadMempool } from 'nexchain core/loaders/mempool/loadMempool'
import { formatStr } from 'nexchain core/lib/formatStr'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'
import { stringToBigInt } from 'nexchain core/loaders/lib/stringToBigint'
import { loadAccountCore } from 'nexchain core/loaders/account/loadAccountCore'

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
		transaction: TxInterfaceCore,
	): Promise<{ isValid: boolean; data?: TxInterfaceCore }> {
		const isValidTx = await transactionValidator(transaction)
		if (!isValidTx) {
			logToConsole('Transaction validation failed')
			return { isValid: isValidTx, data: transaction }
		}

		const isSenderContract = isContract(transaction.sender)

		// Validate balance and update pending balance
		const isBalanceSufficient = isSenderContract
			? await this.handleContractTransaction(transaction)
			: await this.handleUserTransaction(transaction)

		if (!isBalanceSufficient) return { isValid: false, data: transaction }

		// Save transaction to mempool and history
		await saveMempool(transaction)
		await saveTxHistory(transaction.txHash!, transaction)
		logToConsole(
			`Transaction added to mempool TxHash: ${formatStr(transaction.txHash!)}...`,
		)

		return { isValid: true, data: transaction }
	}

	/**
	 * Validates and updates pending balance for contract transactions.
	 * @param transaction - Contract transaction.
	 * @returns True if balance is sufficient, otherwise false.
	 */
	private async handleContractTransaction(
		transaction: TxInterfaceCore,
	): Promise<boolean> {
		const contractManager = new ManageContract(transaction.sender)
		const contractBalance = await contractManager.getContractBalance()
		const bigintContractBalance = stringToBigInt(contractBalance)
		const pendingBalance = await getPendingBalance(transaction.sender)

		const availableBalance =
			bigintContractBalance - (pendingBalance.pendingAmount || 0n)
		if (availableBalance < transaction.amount + (transaction.fee || 0n)) {
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
		transaction: TxInterfaceCore,
	): Promise<boolean> {
		const userBalance = await loadAccountCore(transaction.sender)
		if (!userBalance) {
			logToConsole('Insufficient user balance')
			return false
		}

		const pendingBalance = await getPendingBalance(transaction.sender)
		const availableBalance =
			userBalance.balance - (pendingBalance.pendingAmount || 0n)

		if (availableBalance < transaction.amount + (transaction.fee || 0n)) {
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
		currentPending: bigint,
		transaction: TxInterfaceCore,
	): Promise<void> {
		const newPendingAmount =
			(currentPending || 0n) + transaction.amount + (transaction.fee || 0n)
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
	public async getValidTransactions(): Promise<TxInterfaceCore[]> {
		return (await loadMempool()) as TxInterfaceCore[]
	}
}
