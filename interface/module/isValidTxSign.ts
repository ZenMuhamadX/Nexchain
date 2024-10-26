import { verifySignature } from 'nexchain/sign/verifySIgnature'
import { validateField } from './validateField'
import { TxInterface } from 'interface/structTx'

export const validateTransactionSignature = (
	transaction: TxInterface,
): boolean => {
	return validateField(
		!verifySignature(transaction.txHash!, {
			r: transaction.sign.r,
			s: transaction.sign.s,
			v: transaction.sign.v,
		}),
		'transactionValidator',
		'Invalid signature',
	)
}
