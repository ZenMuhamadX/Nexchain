/** @format */

import winston from 'winston'
import * as path from 'path'
import fs from 'fs'
import { Block } from 'nexchain/model/block/block'
import { logToConsole } from './logging'

// Define log directory and file paths
const logDirPath = path.join(__dirname, '../logs')
const logFilePath = path.join(logDirPath, 'mining_log.log')

// Create directory if it doesn't exist
if (!fs.existsSync(logDirPath)) {
	fs.mkdirSync(logDirPath)
}

// Create Winston logger
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		winston.format.json(),
	),
	transports: [
		new winston.transports.File({
			filename: logFilePath,
		}),
	],
})

// Function to log mining status using Winston
export const mineLog = (status: Block): void => {
	try {
		logToConsole(`Block ${status.block.header.hash} Created Succesfully`)
		logger.info(JSON.stringify(status.block))
	} catch (error) {
		console.error('Error saving mining log:', error)
	}
}
