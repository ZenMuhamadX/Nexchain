import { comTxInterface } from './commonTxInterface'
/**
 * Represents a transaction in the memory pool.
 */

export interface txInterface extends comTxInterface {
	to: string // The recipient of the transaction
	from: string // The sender of the transaction
	amount: number // The amount of cryptocurrency being transferred
	timestamp: number // The timestamp of when the transaction was created
	txHash?: string // The hash of the transaction (optional)
	signature?: string // The digital signature of the transaction
	message: Buffer // An optional message included with the transaction
	fee: number // The fee associated with the transaction (optional)
	status: 'pending' | 'confirmed' | 'rejected' // The status of the transaction (optional)
	isValidate: boolean // Indicates whether the transaction is valid or not
	isPending: boolean // Indicates whether the transaction is pending or not
}
