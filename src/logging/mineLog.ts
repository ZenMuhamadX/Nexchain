/** @format */

import pino from 'pino'
import * as path from 'path'
import fs from 'node:fs'

// Define interface for mining status
interface Status {
	mined_at: string
	hash: string | any
	miner: string
	difficulty: number
	nonce: number | any
}

// Define log directory and file paths
const logDirPath = path.join(__dirname, '../../logs')
const logFilePath = path.join(logDirPath, 'mining_log.log')

if (!fs.existsSync(logDirPath)) {
	fs.mkdirSync(logDirPath)
}

// Create Pino logger with file transport
const logger = pino({ level: 'info' }, pino.destination(logFilePath))

// Function to log mining status using Pino
export const mineLog = (status: Status): void => {
	// Format log message
	const logMessage = {
		mined_at: status.mined_at,
		hash: status.hash,
		miner: status.miner,
		difficulty: status.difficulty,
		nonce: status.nonce,
	}

	try {
		// Write log message to file
		logger.info(logMessage)

		// Optionally print log message to console for confirmation
		console.info('Mining log saved:', logMessage)
	} catch (error) {
		// Handle errors occurring during log saving
		console.error('Error saving mining log:', error)
	}
}
