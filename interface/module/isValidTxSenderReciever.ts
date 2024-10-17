import { txInterface } from 'nexchain/model/interface/memPool.inf'
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
