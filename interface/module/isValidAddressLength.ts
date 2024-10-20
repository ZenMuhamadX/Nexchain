import { TxInterface } from 'interface/Nexcoin.inf'
import { validateField } from './validateField'

export const validateAddressLengths = (transaction: TxInterface): boolean => {
	return (
		validateField(
			transaction.sender.length !== 37,
			'transactionValidator',
			'Invalid transaction sender length',
		) &&
		validateField(
			transaction.receiver.length !== 37,
			'transactionValidator',
			'Invalid receiver address length',
		)
	)
}
