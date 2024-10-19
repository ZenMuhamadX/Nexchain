import { txInterface } from 'nexchain/model/interface/Nexcoin.inf.'
import { validateField } from './validateField'

export const validateAddressLengths = (transaction: txInterface): boolean => {
	return (
		validateField(
			transaction.from.length !== 37,
			'transactionValidator',
			'Invalid transaction sender length',
		) &&
		validateField(
			transaction.to.length !== 37,
			'transactionValidator',
			'Invalid receiver address length',
		)
	)
}
