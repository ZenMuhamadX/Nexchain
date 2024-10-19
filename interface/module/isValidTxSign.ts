import { verifySignature } from 'nexchain/lib/block/verifySIgnature'
import { txInterface } from 'interface/Nexcoin.inf'
import { validateField } from './validateField'

export const validateTransactionSignature = (
	transaction: txInterface,
	publicKey: string,
): boolean => {
	return validateField(
		!verifySignature(transaction, transaction.signature!, publicKey).status,
		'transactionValidator',
		'Invalid signature',
	)
}
