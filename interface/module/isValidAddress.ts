import { txInterface } from 'interface/Nexcoin.inf'
import { validateField } from './validateField'
import { isValidAddress } from 'nexchain/transaction/validate/isValidAddress'

export const validateAddresses = (transaction: txInterface): boolean => {
	return (
		validateField(
			!isValidAddress(transaction.from),
			'transactionValidator',
			'Invalid transaction sender address',
		) &&
		validateField(
			!isValidAddress(transaction.to),
			'transactionValidator',
			'Invalid transaction receiver address',
		)
	)
}
