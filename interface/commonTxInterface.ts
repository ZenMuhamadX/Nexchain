/**
 * Represents a transaction in the memory pool.
 */

export interface comTxInterface {
	receiver: string // The recipient of the transaction
	sender: string // The sender of the transaction
	amount: number // The amount of cryptocurrency being transferred
	timestamp: number // The timestamp of when the transaction was created
	message?: Buffer // An optional message included with the transaction
}
