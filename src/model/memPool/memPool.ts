import { BlockChains } from '../../blockChains'
import { createSignature } from '../../lib/block/createSignature'
import { verifySignature } from '../../lib/block/verifySIgnature'
import { createTxHash } from '../../lib/hash/createTxHash'
import { getKeyPair } from '../../lib/hash/getKeyPair'
import { generateTimestampz } from '../../lib/timestamp/generateTimestampz'
import { createWalletAddress } from '../../lib/wallet/createWallet'
import { loadWallet } from '../../lib/wallet/loadWallet'
import { loggingErr } from '../../logging/errorLog'
import { memPoolInterfaceValidator } from '../../validator/infValidator/mempool.v'
import { memPoolInterface } from '../interface/memPool.inf'

export class MemPool {
	private transactions: memPoolInterface[]

	constructor() {
		this.transactions = []
	}

	/**
	 * Adds a transaction to the memory pool.
	 * @param transaction - The transaction to be added.
	 * @returns True if the transaction was added successfully, otherwise false.
	 */

	public addTransaction(transaction: memPoolInterface): boolean {
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
		console.log(JSON.stringify(transaction))
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

	private validateTransaction(transaction: memPoolInterface): boolean {
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

	public getValidTransactions(): memPoolInterface[] {
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
	public clear(): void {
		this.transactions = []
	}

	/**
	 * Checks if the memory pool has reached its limit.
	 * @returns True if the memory pool has reached the 100, otherwise false.
	 */
	public isFull(): boolean {
		return this.transactions.length >= 100
	}
}

const y = new BlockChains()
const x = new MemPool()
const transact: memPoolInterface = {
	amount: 100,
	from: '0x1',
	to: '0x2',
	signature: '',
	status: 'pending',
}
const transact1: memPoolInterface = {
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
// y.addBlockToChain(x, '0x1')
console.log(y.getLatestBlock().blk.transactions)
