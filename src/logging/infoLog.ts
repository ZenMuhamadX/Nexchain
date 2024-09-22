/** @format */

import pino from 'pino'
import * as path from 'path'
import fs from 'node:fs'

// Define interface for info logging
interface InfoLog {
	message: string
	time: string
	context?: string
	metadata?: any
}

// Define log directory and file paths
const logDirPath = path.join(__dirname, '../../logs')
const logFilePath = path.join(logDirPath, 'info.log')

if (!fs.existsSync(logDirPath)) {
	fs.mkdirSync(logDirPath)
}

// Create Pino logger with file transport
const logger = pino({ level: 'info' }, pino.destination(logFilePath))

// Function to log information using Pino
export const loggingInfo = (info: InfoLog): void => {
	if (info) {
		// Format log message
		const logMessage = {
			message: info.message,
			time: info.time,
			context: info.context || 'N/A',
			metadata: info.metadata || {},
		}

		try {
			// Write info log to file
			logger.info(logMessage)

			// Print info log to console
			console.info('Info details saved to log file.')
			console.info(logMessage)
		} catch (error) {
			// Handle errors occurring during log saving
			console.error('Error saving info log:', error)
		}
	}
}
