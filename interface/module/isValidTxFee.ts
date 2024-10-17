import { txInterface } from 'nexchain/model/interface/memPool.inf'
import { validateField } from './validateField'

export const validateTransactionFees = (transaction: txInterface): boolean => {
	return validateField(
		transaction.fee! > transaction.amount,
		'transactionValidator',
		'Invalid transaction fee',
	)
}
