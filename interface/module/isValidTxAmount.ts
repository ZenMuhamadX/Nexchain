import { validateField } from './validateField'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'

export const validateTransactionAmount = (
	transaction: TxInterfaceCore,
): boolean => {
	return validateField(
		transaction.amount <= 0n,
		'transactionValidator',
		'Invalid transaction amount',
	)
}
