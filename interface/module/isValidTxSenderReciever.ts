import { TxInterface } from 'interface/Nexcoin.inf'
import { validateField } from './validateField'

export const validateTransactionSenderReceiver = (
	transaction: TxInterface,
): boolean => {
	return validateField(
		transaction.sender === transaction.receiver,
		'transactionValidator',
		'Invalid transaction sender and receiver',
	)
}
