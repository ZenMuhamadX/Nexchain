import { validateAddresses } from 'interface/module/isValidAddress'
import { validateAddressLengths } from 'interface/module/isValidAddressLength'
import { validateTransactionAmount } from 'interface/module/isValidTxAmount'
import { validateTransactionFees } from 'interface/module/isValidTxFee'
import { validateTransactionSenderReceiver } from 'interface/module/isValidTxSenderReciever'
import { validateTransactionSignature } from 'interface/module/isValidTxSign'
import { logError } from 'interface/module/writeLog'
import { TxInterface } from 'interface/structTx'
import { txInterfaceValidator } from 'interface/validation/joi/txInterface'
import { isNexu } from 'nexchain/nexucoin/isNexu'
import { clientHasSufficientBalance } from './clientHasSufficient'

export const clientSideTxValidate = async (
	transaction: TxInterface,
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

	if (!isNexu(transaction.amount)) return false

	if (
		!(await clientHasSufficientBalance(
			transaction.sender,
			transaction.amount,
			transaction.fee!,
		))
	) {
		return false
	}
	return true
}
