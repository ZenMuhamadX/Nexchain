import { loggingErr } from 'logging/errorLog'
import { COM } from '../interface/COM'
import { COMValidate } from '../interface/validate'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'

export const validateMessageInterface = (data: COM): boolean => {
	const { error, warning } = COMValidate.validate(data)
	if (error) {
		loggingErr({
			context: 'validateMessageInterface',
			error,
			stack: new Error().stack,
			time: generateTimestampz(),
			hint: 'Invalid Command',
			warning,
		})
		return false
	}
	return true
}
