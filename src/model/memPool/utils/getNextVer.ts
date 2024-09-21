// Import the file system and path modules
import fs from 'node:fs'
import path from 'node:path'
import { loggingErr } from '../../../logging/errorLog'
import { generateTimestampz } from '../../../lib/timestamp/generateTimestampz'
import { loadStateVersion } from './loadStateVer'

// Function to get the next version number
export const getNextMempoolVersion = () => {
	try {
		const dirPath = path.join(__dirname, '../../../../config')
		const filePath = path.join(dirPath, 'statePool.config.json')

		// Read the current version from the config file
		let state: number = loadStateVersion()
		state++

		// Update the version in the config file
		const config = {
			poolVersion: state,
		}
		fs.writeFileSync(filePath, JSON.stringify(config, null, 4))
		return state
	} catch (error) {
		// Handle any errors that occurred during the process
		loggingErr({
			error: error,
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return null
	}
}
