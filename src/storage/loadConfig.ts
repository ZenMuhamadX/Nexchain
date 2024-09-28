import fs from 'fs'
import path from 'path'
import { defaultConfig } from '../model/interface/defaultConf.inf'
import { loggingErr } from '../logging/errorLog'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'
import { saveConfigFile } from './saveConfig'

export const loadConfig = (): defaultConfig | null => {
	try {
		// Construct the path to the configuration file
		const dirPath = path.join(__dirname, '../../../config')
		const filePath = path.join(dirPath, 'chains.config.json')

		// Check if the file exists
		if (!fs.existsSync(filePath)) {
			saveConfigFile()
		}

		// Read the file contents
		const files = fs.readFileSync(filePath, 'utf-8')

		// Parse the JSON data and return
		return JSON.parse(files)
	} catch (error) {
		// Handle potential errors during file reading or parsing
		loggingErr({
			error: error,
			context: 'loadConfig',
			hint: 'Error loading configuration file',
			warning: null,
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		return null
	}
}
