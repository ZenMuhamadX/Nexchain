import { loggingErr } from 'logging/errorLog'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'

export const logError = (
	context: string,
	hint: string,
	error: any,
): boolean => {
	loggingErr({
		context,
		hint,
		level: 'error',
		message: error,
		priority: 'high',
		timestamp: generateTimestampz(),
		stack: new Error().stack!,
	})
	return false
}
