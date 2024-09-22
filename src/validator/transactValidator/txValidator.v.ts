import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { memPoolInterfaceValidator } from '../infValidator/mempool.v'
import { loggingErr } from 'src/logging/errorLog'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { verifySignature } from 'src/lib/block/verifySIgnature'
import { getKeyPair } from 'src/lib/hash/getKeyPair'

export const transactionValidator = (transaction: MemPoolInterface) => {
	const validateInf = memPoolInterfaceValidator.validate(transaction)
	if (validateInf.error) {
		loggingErr({
			context: 'transactionValidator',
			hint: 'Invalid transaction',
			warning: validateInf.warning,
			error: validateInf.error.message,
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return false
	} else if (transaction.amount <= 0) {
		loggingErr({
			context: 'transactionValidator',
			hint: 'Invalid transaction amount',
			warning: null,
			error: 'Invalid transaction amount',
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return false
	} else if (!verifySignature(transaction, transaction.signature as string)) {
		loggingErr({
			context: 'transactionValidator',
			hint: 'Invalid signature',
			warning: null,
			error: 'Invalid signature',
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return false
	} else if (transaction.from === transaction.to) {
		loggingErr({
			context: 'transactionValidator',
			hint: 'Invalid transaction sender and receiver',
			warning: null,
			error: 'Invalid transaction sender and receiver',
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return false
	} else if (transaction.from === getKeyPair().publicKey) {
		loggingErr({
			context: 'transactionValidator',
			hint: 'Invalid transaction sender',
			warning: null,
			error: 'Invalid transaction sender',
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return false
	}
	transaction.status = 'confirmed'
	return true
}
