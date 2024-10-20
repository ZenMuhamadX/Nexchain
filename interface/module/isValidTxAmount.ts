import { TxInterface } from 'interface/Nexcoin.inf'
import { validateField } from './validateField'

export const validateTransactionAmount = (
	transaction: TxInterface,
): boolean => {
	return validateField(
		transaction.amount <= 0,
		'transactionValidator',
		'Invalid transaction amount',
	)
}
