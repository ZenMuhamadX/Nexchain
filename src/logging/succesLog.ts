/** @format */

import pino from 'pino'
import * as path from 'path'
import fs from 'node:fs'

// Define interface for block information
interface BlockInfo {
	timestamp?: string
	hash?: string
	previousHash?: string
	height?: number
	signature?: string
	message?: string
	nonce?: string
}

// Define log directory and file paths
const logDirPath = path.join(__dirname, '../../log')
const logFilePath = path.join(logDirPath, 'blockfile.log')

if (!fs.existsSync(logDirPath)) {
	fs.mkdirSync(logDirPath)
}

// Create Pino logger with file transport
const logger = pino({ level: 'info' }, pino.destination(logFilePath))

// Function to log block information using Pino
export const successLog = (blockInfo: BlockInfo): void => {
	// Format log message
	const logMessage = {
		timestamp: blockInfo.timestamp || 'N/A',
		height: blockInfo.height,
		message: blockInfo.message || 'N/A',
		hash: blockInfo.hash || 'N/A',
		previousHash: blockInfo.previousHash || 'N/A',
		nonce: blockInfo.nonce !== undefined ? blockInfo.nonce : 'N/A',
		signature: blockInfo.signature || 'N/A',
	}

	try {
		// Write log message to file
		logger.info(logMessage)

		// Optionally print log message to console for confirmation
		console.info('Log saved:', logMessage)
	} catch (error) {
		// Handle errors occurring during log saving
		console.error('Error saving log:', error)
	}
}
