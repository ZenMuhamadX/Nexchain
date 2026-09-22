import { validateField } from './validateField'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'

export const validateAddressLengths = (
	transaction: TxInterfaceCore,
): boolean => {
	return (
		validateField(
			transaction.sender.length !== 43,
			'transactionValidator',
			'Invalid transaction sender length',
		) &&
		validateField(
			transaction.receiver.length !== 43,
			'transactionValidator',
			'Invalid receiver address length',
		)
	)
}
