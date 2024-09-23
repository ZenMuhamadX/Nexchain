import { loggingInfo } from 'src/logging/infoLog'
import { leveldb } from '../../init'
import { loggingErr } from 'src/logging/errorLog'
import { structJsonValue } from '../../struct/structJsonValue'

export const putDataTransaction = async (
	txHash: string,
	value: structJsonValue
): Promise<void> => {
	try {
		await leveldb.put(txHash, value)
		loggingInfo({
			message: 'Successfully put data',
			time: new Date().toISOString(),
			context: 'leveldb',
			metadata: { txHash },
		})
	} catch (error) {
		loggingErr({
			error: 'Error putting data',
			time: new Date().toISOString(),
			context: 'leveldb',
			stack: new Error().stack,
			hint: 'An unexpected error occurred while putting data.',
			warning: null,
		})
	}
}
