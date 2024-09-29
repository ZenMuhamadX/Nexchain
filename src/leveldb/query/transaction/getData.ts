import { loggingInfo } from 'src/logging/infoLog'
import { leveldb } from '../../init'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { loggingErr } from 'src/logging/errorLog'
import { structJsonValue } from '../../struct/structJsonValue'

export const getDataTransaction = async (
	txHash: string,
): Promise<structJsonValue | null> => {
	try {
		const value = await leveldb.get(txHash)
		if (!value) {
			loggingErr({
				error: 'data not found',
				stack: new Error().stack,
				hint: 'data not found',
				time: generateTimestampz(),
				warning: null,
				context: 'leveldb',
			})
			return null
		}
		loggingInfo({
			message: 'Successfully get data',
			time: generateTimestampz(),
			context: 'leveldb',
			metadata: { txHash },
		})
		return JSON.parse(value) as structJsonValue
	} catch (error) {
		loggingErr({
			error: error,
			time: generateTimestampz(),
			context: 'leveldb',
			stack: new Error().stack,
			hint: 'An unexpected error occurred while getting data.',
			warning: null,
		})
		return null
	}
}
