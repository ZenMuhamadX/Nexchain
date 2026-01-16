import { verifySignature } from 'wallet/crypto/sign/verifySignature'
import { validateField } from './validateField'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'

export const validateTransactionSignature = (
	transaction: TxInterfaceCore,
): boolean => {
	return validateField(
		!verifySignature(transaction.txHash!, transaction.sign),
		'transactionValidator',
		'Invalid signature',
	)
}
