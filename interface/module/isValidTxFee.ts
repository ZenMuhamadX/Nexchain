import { txInterface } from 'nexchain/model/interface/Nexcoin.inf.'
import { validateField } from './validateField'

export const validateTransactionFees = (transaction: txInterface): boolean => {
	return validateField(
		transaction.fee! > transaction.amount,
		'transactionValidator',
		'Invalid transaction fee',
	)
}
