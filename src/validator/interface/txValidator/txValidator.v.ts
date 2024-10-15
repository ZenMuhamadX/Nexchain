import { txInterface } from 'src/model/interface/memPool.inf'
import { txInterfaceValidator } from '../infValidator/mempool.v'
import { loggingErr } from 'src/logging/errorLog'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { verifySignature } from 'src/lib/block/verifySIgnature'
import { hasSufficientBalance } from 'src/wallet/balance/utils/hasSufficientBalance'

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

export const transactionValidator = async (
	transaction: txInterface,
	publicKey: string,
	privateKey: string,
): Promise<boolean> => {
	const validateInf = txInterfaceValidator.validate(transaction)
	if (validateInf.error) {
		return logError(
			'transactionValidator',
			'Invalid transaction',
			validateInf.error.message,
		)
	}

	if (transaction.amount <= 0) {
		return logError(
			'transactionValidator',
			'Invalid transaction amount',
			'Invalid transaction amount',
		)
	}

	if (!verifySignature(transaction, transaction.signature!, publicKey).status) {
		return logError(
			'transactionValidator',
			'Invalid signature',
			'Invalid signature',
		)
	}

	if (transaction.from === transaction.to) {
		return logError(
			'transactionValidator',
			'Invalid transaction sender and receiver',
			'Invalid transaction sender and receiver',
		)
	}
	if (transaction.from === publicKey) {
		return logError(
			'transactionValidator',
			'Invalid transaction sender',
			'Invalid transaction sender',
		)
	}
	if (transaction.to === privateKey) {
		return logError(
			'transactionValidator',
			'Invalid transaction receiver',
			'Invalid transaction receiver',
		)
	}

	if (transaction.fee! > transaction.amount) {
		return logError(
			'transactionValidator',
			'Invalid transaction fee',
			'Invalid transaction fee',
		)
	}

	const res = await hasSufficientBalance(
		transaction.from,
		transaction.amount,
		transaction.fee!,
	)
	if (!res) {
		return logError(
			'transactionValidator',
			'Insufficient balance',
			'Insufficient balance',
		)
	}

	transaction.status = 'pending'
	transaction.isValidate = true
	transaction.isPending = true
	console.log(`TxNHash: ${transaction.txHash}`)
	return true
}
