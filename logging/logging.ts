/** @format */

import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import chalk from 'chalk'

export const logToConsole = (message: string) => {
	const thisTimestamp = generateTimestampz()
	const date = new Date(thisTimestamp).toISOString()

	console.info(
		`(${chalk.green('info')}) [${chalk.yellowBright(date)}]: ${chalk.cyan(message)}`,
	)
}
