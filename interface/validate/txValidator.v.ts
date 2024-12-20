import { txInterfaceValidator } from './joi/txInterface'
import { hasSufficientBalance } from 'nexchain/account/utils/hasSufficientBalance'
import { validateTransactionAmount } from 'interface/module/isValidTxAmount'
import { logError } from 'interface/module/writeLog'
import { validateTransactionSignature } from 'interface/module/isValidTxSign'
import { validateTransactionSenderReceiver } from 'interface/module/isValidTxSenderReciever'
import { validateTransactionFees } from 'interface/module/isValidTxFee'
import { validateAddresses } from 'interface/module/isValidAddress'
import { validateAddressLengths } from 'interface/module/isValidAddressLength'
import { TxInterface } from 'interface/structTx'
import { isNexu } from 'nexchain/nexucoin/isNexu'

export const transactionValidator = async (
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
		!(await hasSufficientBalance(
			transaction.sender,
			transaction.amount,
			transaction.fee!,
		))
	) {
		return logError(
			'transactionValidator',
			'Insufficient balance',
			'Insufficient balance',
		)
	}

	transaction.status = 'pending'
	transaction.isValid = transaction.isPending = true
	return true
}
