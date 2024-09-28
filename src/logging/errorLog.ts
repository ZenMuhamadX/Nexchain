/** @format */

import pino from 'pino'
import * as path from 'path'
import fs from 'node:fs'
// Define interface for error information
interface ErrorInfo {
	error: string | any
	time: string
	hint?: string
	warning?: any
	stack: any
	context: string
}

// Define log directory and file paths
const logDirPath = path.join(__dirname, '../../logs')
const logFilePath = path.join(logDirPath, 'error_log.log')

if (!fs.existsSync(logDirPath)) {
	fs.mkdirSync(logDirPath)
}

// Create Pino logger with file transport
const logger = pino({ level: 'error' }, pino.destination(logFilePath))

// Function to log error information using Pino
export const loggingErr = (err: ErrorInfo): void => {
	if (err) {
		// Format log message
		const logMessage = {
			context: err.context,
			error: err.error,
			time: err.time,
			hint: err.hint || 'N/A',
			warning: err.warning || 'N/A',
			stack: err.stack || 'N/A',
		}

		try {
			// Write error log to file
			logger.error(logMessage)

			// Print error log to console
			console.error('Error details saved to log file.')
			console.error(logMessage)
		} catch (error) {
			// Handle errors occurring during log saving
			console.error('Error saving error log:', error)
		}
	}
}
