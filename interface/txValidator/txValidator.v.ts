import { txInterface } from 'nexchain/model/interface/memPool.inf'
import { txInterfaceValidator } from '../infValidator/mempool.v'
import { loggingErr } from 'logging/errorLog'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { verifySignature } from 'nexchain/lib/block/verifySIgnature'
import { hasSufficientBalance } from 'nexchain/account_based/balance/utils/hasSufficientBalance'

const logError = (context: string, hint: string, error: any): boolean => {
	loggingErr({
		context,
		hint,
		warning: null,
		error,
		stack: new Error().stack,
		time: generateTimestampz(),
	})
	return false
}

const validateField = (
	condition: boolean,
	context: string,
	hint: string,
): boolean => {
	if (!condition) return logError(context, hint, hint)
	return true
}

export const transactionValidator = async (
	transaction: txInterface,
	publicKey: string,
	privateKey: string,
): Promise<boolean> => {
	const { error } = txInterfaceValidator.validate(transaction)
	if (error || transaction.amount <= 0)
		return logError(
			'transactionValidator',
			'Invalid transaction',
			error?.message || 'Invalid transaction amount',
		)

	if (!verifySignature(transaction, transaction.signature!, publicKey).status)
		return logError(
			'transactionValidator',
			'Invalid signature',
			'Invalid signature',
		)
	if (transaction.from === transaction.to)
		return logError(
			'transactionValidator',
			'Invalid transaction sender and receiver',
			'Invalid transaction sender and receiver',
		)
	if (
		!validateField(
			transaction.from !== publicKey,
			'transactionValidator',
			'Invalid transaction sender',
		)
	)
		return false
	if (
		!validateField(
			transaction.to !== privateKey,
			'transactionValidator',
			'Invalid transaction receiver',
		)
	)
		return false
	if (
		!validateField(
			transaction.fee! <= transaction.amount,
			'transactionValidator',
			'Invalid transaction fee',
		)
	)
		return false
	if (
		!validateField(
			transaction.to.length === 37,
			'transactionValidator',
			'Invalid transaction receiver',
		)
	)
		return false
	if (
		!validateField(
			transaction.from.length === 37,
			'transactionValidator',
			'Invalid transaction sender',
		)
	)
		return false

	if (
		!(await hasSufficientBalance(
			transaction.from,
			transaction.amount,
			transaction.fee!,
		))
	)
		return logError(
			'transactionValidator',
			'Insufficient balance',
			'Insufficient balance',
		)

	transaction.status = 'pending'
	transaction.isValidate = transaction.isPending = true
	console.log(`TxnHash: ${transaction.txHash}`)
	return true
}
