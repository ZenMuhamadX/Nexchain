/**
 * Represents a transaction in the memory pool.
 */

export interface comTxInterface {
	receiver: string // The recipient of the transaction
	format: 'NXC' | 'nexu'
	sender: string // The sender of the transaction
	amount: number // The amount of cryptocurrency being transferred
	timestamp: number // The timestamp of when the transaction was created
	fee: number // The fee associated with the transaction
	extraMessage?: string // An optional message included with the transaction
}
