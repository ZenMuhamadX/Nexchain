import { loggingErr } from 'logging/errorLog'
import { COM } from '../interface/COM'
import { COMValidate } from '../interface/validate'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'

export const validateMessageInterface = (data: COM): boolean => {
	const { error } = COMValidate.validate(data)
	if (error) {
		loggingErr({
			context: 'validateMessageInterface',
			level: 'error',
			message: error.message,
			priority: 'high',
			timestamp: generateTimestampz(),
			stack: error.stack!,
			hint: 'Invalid message format',
		})
		return false
	}
	return true
}
