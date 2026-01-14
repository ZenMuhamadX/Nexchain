import { validateField } from './validateField'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'

export const validateTransactionFees = (
	transaction: TxInterfaceCore,
): boolean => {
	return validateField(
		transaction.fee! > transaction.amount,
		'transactionValidator',
		'Invalid transaction fee',
	)
}
