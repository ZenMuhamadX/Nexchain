import { loggingInfo } from 'src/logging/infoLog'
import { leveldb } from '../../init'
import { loggingErr } from 'src/logging/errorLog'
import { structJsonValue } from '../../struct/structJsonValue'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'

export const putDataTransaction = async (
	txHash: string,
	value: structJsonValue,
): Promise<void> => {
	try {
		await leveldb.put(txHash, value)
		loggingInfo({
			message: 'Successfully put data',
			time: generateTimestampz(),
			context: 'leveldb',
			metadata: { txHash },
		})
	} catch (error) {
		loggingErr({
			error: 'Error putting data',
			time: generateTimestampz(),
			context: 'leveldb',
			stack: new Error().stack,
			hint: 'An unexpected error occurred while putting data.',
			warning: null,
		})
	}
}
