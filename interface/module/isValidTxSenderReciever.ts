import { validateField } from './validateField'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'

export const validateTransactionSenderReceiver = (
	transaction: TxInterfaceCore,
): boolean => {
	return validateField(
		transaction.sender === transaction.receiver,
		'transactionValidator',
		'Invalid transaction sender and receiver',
	)
}
