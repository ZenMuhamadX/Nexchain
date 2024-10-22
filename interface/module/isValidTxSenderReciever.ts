import { TxInterface } from 'interface/structTx'
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
