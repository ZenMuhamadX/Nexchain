import { txInterfaceValidator } from './joi/mempool.v'
import { hasSufficientBalance } from 'nexchain/account/utils/hasSufficientBalance'
import { validateTransactionAmount } from 'interface/module/isValidTxAmount'
import { logError } from 'interface/module/writeLog'
import { validateTransactionSignature } from 'interface/module/isValidTxSign'
import { validateTransactionSenderReceiver } from 'interface/module/isValidTxSenderReciever'
import { validateTransactionFees } from 'interface/module/isValidTxFee'
import { validateAddresses } from 'interface/module/isValidAddress'
import { validateAddressLengths } from 'interface/module/isValidAddressLength'
import { TxInterface } from 'interface/structTx'

export const transactionValidator = async (
	transaction: TxInterface,
	publicKey: string,
): Promise<boolean> => {
	const { error } = txInterfaceValidator.validate(transaction)

	if (error || !validateTransactionAmount(transaction)) {
		return logError(
			'transactionValidator',
			'Invalid transaction',
			error?.message || 'Invalid transaction amount',
		)
	}

	if (!validateTransactionSignature(transaction, publicKey)) return false

	if (!validateTransactionSenderReceiver(transaction)) return false

	if (!validateTransactionFees(transaction)) return false

	if (!validateAddresses(transaction)) return false

	if (!validateAddressLengths(transaction)) return false

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
	console.log(`TxnHash: ${transaction.txHash}`)
	return true
}
