import { loggingErr } from "logging/errorLog"
import { generateTimestampz } from "nexchain/lib/timestamp/generateTimestampz"

export const logError = (context: string, hint: string, error: any): boolean => {
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
