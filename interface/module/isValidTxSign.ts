import { verifySignature } from 'sign/verifySIgnature'
import { validateField } from './validateField'
import { TxInterface } from 'interface/structTx'

export const validateTransactionSignature = (
	transaction: TxInterface,
): boolean => {
	return validateField(
		!verifySignature(transaction.txHash!, transaction.sign),
		'transactionValidator',
		'Invalid signature',
	)
}
