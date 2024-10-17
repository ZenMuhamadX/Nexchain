import { verifySignature } from 'nexchain/lib/block/verifySIgnature'
import { txInterface } from 'nexchain/model/interface/memPool.inf'
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
