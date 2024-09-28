import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { memPoolInterfaceValidator } from '../infValidator/mempool.v'
import { loggingErr } from 'src/logging/errorLog'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { verifySignature } from 'src/lib/block/verifySIgnature'
import { getKeyPair } from 'src/lib/hash/getKeyPair'

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

export const transactionValidator = (
	transaction: MemPoolInterface,
): boolean => {
	const validateInf = memPoolInterfaceValidator.validate(transaction)
	if (validateInf.error)
		return (
			logError(
				'transactionValidator',
				'Invalid transaction',
				validateInf.error.message,
			) || false
		)

	if (transaction.amount <= 0)
		return (
			logError(
				'transactionValidator',
				'Invalid transaction amount',
				'Invalid transaction amount',
			) || false
		)

	if (!verifySignature(transaction, transaction.signature!).status)
		return (
			logError(
				'transactionValidator',
				'Invalid signature',
				'Invalid signature',
			) || false
		)

	if (transaction.from === transaction.to)
		return (
			logError(
				'transactionValidator',
				'Invalid transaction sender and receiver',
				'Invalid transaction sender and receiver',
			) || false
		)

	const { publicKey, privateKey } = getKeyPair()
	if (transaction.from === publicKey)
		return (
			logError(
				'transactionValidator',
				'Invalid transaction sender',
				'Invalid transaction sender',
			) || false
		)
	if (transaction.to === privateKey)
		return (
			logError(
				'transactionValidator',
				'Invalid transaction receiver',
				'Invalid transaction receiver',
			) || false
		)

	if (transaction.fee! <= 0 || transaction.fee! > transaction.amount)
		return (
			logError(
				'transactionValidator',
				'Invalid transaction fee',
				'Invalid transaction fee',
			) || false
		)
	transaction.status = 'confirmed'
	return true
}
