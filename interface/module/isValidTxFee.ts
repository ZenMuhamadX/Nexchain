import { TxInterface } from 'interface/structTx'
import { validateField } from './validateField'

export const validateTransactionFees = (transaction: TxInterface): boolean => {
	return validateField(
		transaction.fee! > transaction.amount,
		'transactionValidator',
		'Invalid transaction fee',
	)
}
