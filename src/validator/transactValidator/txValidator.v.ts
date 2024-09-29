import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { memPoolInterfaceValidator } from '../infValidator/mempool.v'
import { loggingErr } from 'src/logging/errorLog'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { verifySignature } from 'src/lib/block/verifySIgnature'
import { getKeyPair } from 'src/lib/hash/getKeyPair'
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
	transaction: MemPoolInterface,
): Promise<boolean> => {
	const validateInf = memPoolInterfaceValidator.validate(transaction)
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

	if (!verifySignature(transaction, transaction.signature!).status) {
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

	const { publicKey, privateKey } = getKeyPair()
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

	if (transaction.fee! <= 0 || transaction.fee! > transaction.amount) {
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

	transaction.status = 'confirmed'
	return true
}
