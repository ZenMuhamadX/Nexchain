import { TxInterface } from 'interface/Nexcoin.inf'
import { validateField } from './validateField'
import { isValidAddress } from 'nexchain/transaction/validate/isValidAddress'

export const validateAddresses = (transaction: TxInterface): boolean => {
	return (
		validateField(
			!isValidAddress(transaction.sender),
			'transactionValidator',
			'Invalid transaction sender address',
		) &&
		validateField(
			!isValidAddress(transaction.receiver),
			'transactionValidator',
			'Invalid transaction receiver address',
		)
	)
}
