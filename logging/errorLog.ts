import winston from 'winston'
import * as path from 'path'
import fs from 'fs'
import { logToConsole } from './logging'

// Define ErrorInfo interface
interface ErrorInfo {
	timestamp: number
	level: 'error'
	message: string
	context: string
	stack: string
	priority: 'low' | 'high'
	hint?: string
}

// Define log directory and file paths
const logDirPath = path.join(__dirname, '../logs')
const logFilePath = path.join(logDirPath, 'error_log.log')

// Create log directory if it doesn't exist
if (!fs.existsSync(logDirPath)) {
	fs.mkdirSync(logDirPath)
}

// Create Winston logger
const logger = winston.createLogger({
	level: 'error',
	format: winston.format.json(), // Log directly as JSON
	transports: [
		new winston.transports.File({ filename: logFilePath }),
		new winston.transports.Console({
			format: winston.format.printf((info) => JSON.stringify(info)), // No formatting, just raw JSON
		}),
	],
})

// Function to log errors
export const loggingErr = (err: ErrorInfo): void => {
	if (err) {
		const { priority, ...logMessage } = err

		// Log the error to file
		logger.info(logMessage)

		// Display only high-priority errors in the console
		if (priority === 'high') {
			console.error(logMessage)
		} else {
			logToConsole('Non-critical error logged to file.')
		}
	}
}
