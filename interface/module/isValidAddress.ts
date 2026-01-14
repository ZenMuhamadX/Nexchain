import { validateField } from './validateField'
import { isValidAddress } from 'nexchain core/transaction/utils/isValidAddress'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'

export const validateAddresses = (transaction: TxInterfaceCore): boolean => {
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
