import { txInterface } from 'nexchain/model/interface/memPool.inf'
import { validateField } from './validateField'

export const validateTransactionAmount = (
	transaction: txInterface,
): boolean => {
	return validateField(
		transaction.amount <= 0,
		'transactionValidator',
		'Invalid transaction amount',
	)
}
