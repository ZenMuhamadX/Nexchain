import { txInterface } from 'interface/Nexcoin.inf'
import { validateField } from './validateField'

export const validateTransactionSenderReceiver = (
	transaction: txInterface,
): boolean => {
	return validateField(
		transaction.from === transaction.to,
		'transactionValidator',
		'Invalid transaction sender and receiver',
	)
}
