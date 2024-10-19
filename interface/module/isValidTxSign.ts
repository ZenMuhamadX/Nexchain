import { verifySignature } from 'nexchain/lib/block/verifySIgnature'
import { validateField } from './validateField'
import { TxInterface } from 'interface/Nexcoin.inf'

export const validateTransactionSignature = (
	transaction: TxInterface,
	publicKey: string,
): boolean => {
	return validateField(
		!verifySignature(transaction, transaction.signature!, publicKey).status,
		'transactionValidator',
		'Invalid signature',
	)
}
