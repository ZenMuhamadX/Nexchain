import { validateAddresses } from 'interface/module/isValidAddress'
import { validateAddressLengths } from 'interface/module/isValidAddressLength'
import { validateTransactionAmount } from 'interface/module/isValidTxAmount'
import { validateTransactionFees } from 'interface/module/isValidTxFee'
import { validateTransactionSenderReceiver } from 'interface/module/isValidTxSenderReciever'
import { validateTransactionSignature } from 'interface/module/isValidTxSign'
import { logError } from 'interface/module/writeLog'
import { txInterfaceValidator } from 'interface/validation/joi/txInterface'
import { isNexu } from 'nexchain core/nexucoin/isNexu'
import { clientHasSufficientBalance } from './clientHasSufficient'
import { stringToBigInt } from 'nexchain core/loaders/lib/stringToBigint'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'

export const clientSideTxValidate = async (
	transaction: TxInterfaceCore,
): Promise<boolean> => {
	const { error } = txInterfaceValidator.validate(transaction)

	if (error || !validateTransactionAmount(transaction)) {
		return logError(
			'transactionValidator',
			'Invalid transaction',
			error?.message || 'Invalid transaction amount',
		)
	}
	if (!validateTransactionSignature(transaction)) return false

	if (!validateTransactionSenderReceiver(transaction)) return false

	if (!validateTransactionFees(transaction)) return false

	if (!validateAddresses(transaction)) return false

	if (!validateAddressLengths(transaction)) return false

	if (!isNexu(stringToBigInt(transaction.amount))) return false

	if (
		!(await clientHasSufficientBalance(
			transaction.sender,
			stringToBigInt(transaction.amount),
			stringToBigInt(transaction.fee!),
		))
	) {
		return false
	}
	return true
}
