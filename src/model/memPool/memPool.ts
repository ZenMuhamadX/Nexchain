import { BlockChains } from '../../blockChains'
import { createSignature } from '../../lib/block/createSignature'
import { verifySignature } from '../../lib/block/verifySIgnature'
import { createTxHash } from '../../lib/hash/createTxHash'
import { getKeyPair } from '../../lib/hash/getKeyPair'
import { generateTimestampz } from '../../lib/timestamp/generateTimestampz'
import { loadConfig } from '../../lib/utils/loadConfig'
import { createWalletAddress } from '../../lib/wallet/createWallet'
import { loggingErr } from '../../logging/errorLog'
import { miningBlock } from '../../miner/mining'
import { memPoolInterfaceValidator } from '../../validator/infValidator/mempool.v'
import { MemPoolInterface } from '../interface/memPool.inf'

export class MemPool {
	private transactions: MemPoolInterface[]

	constructor() {
		this.transactions = []
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully, otherwise false.
	 */

	public addTransaction(transaction: MemPoolInterface): boolean {
		if (this.isFull()) {
			loggingErr({
				error: new Error('Memory pool is full'),
				stack: new Error().stack,
				time: generateTimestampz(),
			})
			return false
		}
		transaction.txHash = createTxHash(transaction)
		transaction.timestamp = generateTimestampz()
		transaction.status = 'pending'
		const isValidTx = this.validateTransaction(transaction)
		if (!isValidTx) {
			loggingErr({
				error: new Error('Invalid transaction data'),
				stack: new Error().stack,
				time: generateTimestampz(),
			})
			return false
		}
		this.transactions.push(transaction)
		return true
	}

	private validateTransaction(transaction: MemPoolInterface): boolean {
		const validateInf = memPoolInterfaceValidator.validate(transaction)
		if (validateInf.error) {
			loggingErr({
				error: validateInf.error.message,
				stack: new Error().stack,
				time: generateTimestampz(),
			})
			return false
		} else if (transaction.amount <= 0) {
			loggingErr({
				error: 'Invalid transaction amount',
				stack: new Error().stack,
				time: generateTimestampz(),
			})
			return false
		} else if (!verifySignature(transaction, transaction.signature)) {
			loggingErr({
				error: 'Invalid signature',
				stack: new Error().stack,
				time: generateTimestampz(),
			})
			return false
		} else if (transaction.from === transaction.to) {
			loggingErr({
				error: 'Invalid transaction sender and receiver',
				stack: new Error().stack,
				time: generateTimestampz(),
			})
			return false
		} else if (transaction.from === getKeyPair().publicKey) {
			loggingErr({
				error: 'Invalid transaction sender',
				stack: new Error().stack,
				time: generateTimestampz(),
			})
			return false
		}
		transaction.status = 'confirmed'
		return true
	}

	/**
	 * Gets all valid transactions in the memory pool.
	 * @returns An array of transactions.
	 */

	public getValidTransactions(): MemPoolInterface[] {
		return this.transactions
	}

	/**
	 * Removes a specific transaction from the memory pool.
	 * @param txHash - The hash of the transaction to be removed.
	 * @returns True if the transaction was removed, otherwise false.
	 */
	public removeTransaction(txHash: string): boolean {
		const index = this.transactions.findIndex(
			(transaction) => transaction.txHash === txHash,
		)
		if (index !== -1) {
			this.transactions.splice(index, 1)
			return true
		}
		return false
	}

	/**
	 * Returns the number of transactions in the memory pool.
	 * @returns The number of transactions.
	 */
	public size(): number {
		return this.transactions.length
	}

	/**
	 * Clears all transactions from the memory pool.
	 */
	// private clear(): void {
	// 	this.transactions = []
	// }

	/**
	 * Checks if the memory pool has reached its limit. if transaction limit will be clear and
	 * @returns True if the memory pool has reached the 100, otherwise false.
	 */
	public isFull(): boolean {
		const maxTransactions = loadConfig()?.memPool.maxMempoolSize as number
		return this.transactions.length >= maxTransactions
	}
}

const y = new BlockChains()
const x = new MemPool()
const transact: MemPoolInterface = {
	amount: 100,
	from: '0x1',
	to: '0x2',
	signature: '',
	status: 'pending',
}
const transact1: MemPoolInterface = {
	amount: 100,
	from: createWalletAddress(),
	to: '0x4',
	signature: '',
	status: 'pending',
}

transact.signature = createSignature(transact).signature
transact1.signature = createSignature(transact1).signature
x.addTransaction(transact)
x.addTransaction(transact1)
miningBlock(createWalletAddress())
console.log(y.getLatestBlock().blk.transactions)
