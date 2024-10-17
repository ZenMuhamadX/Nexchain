import { logError } from "./writeLog"

export const validateField = (
	writeError: boolean,
	context: string,
	hint: string,
): boolean => {
	if (writeError) {
		logError(context, hint, hint)
		return false
	}
	return true
}
