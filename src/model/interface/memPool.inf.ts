/**
 * Represents a transaction in the memory pool.
 */
export interface memPoolInterface {
	to: string // The recipient of the transaction
	from: string // The sender of the transaction
	amount: number // The amount of cryptocurrency being transferred
	txHash?: string // The hash of the transaction (optional)
	timestamp: number | string // The timestamp of when the transaction was created
	signature: string // The digital signature of the transaction
	message?: string // An optional message included with the transaction
}
