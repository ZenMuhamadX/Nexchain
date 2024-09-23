import msgpack from 'msgpack-lite'
import fs from 'node:fs'
import path from 'node:path'
import { loggingErr } from '../../logging/errorLog'
import { generateTimestampz } from '../../lib/timestamp/generateTimestampz'

export const loadMempool = () => {
	try {
		// Determine the directory path for mempool versions
		const dirPath = path.join(__dirname, '../../../mempool_versions')

		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true })
		}
		// Read all files in the directory
		const files = fs.readdirSync(dirPath)

		// Filter for files that match the mempool versioning pattern (e.g., mempool_v1.bin)
		const versionFiles = files.filter(
			(file) => file.startsWith('mempool_v') && file.endsWith('.bin'),
		)

		// Extract version numbers from file names and store them with file names
		const version = versionFiles
			.map((file) => {
				const match = file.match(/mempool_v(\d+)\.bin/)
				return match ? { version: parseInt(match[1], 10), file } : null
			})
			// Remove any null values (files that didn't match the pattern)
			.filter(Boolean)

		// If no mempool versions are found, return null
		if (version.length === 0) {
			return null
		}

		// Find the latest version
		const latest = version.reduce((prev, curr) =>
			prev!.version > curr!.version ? prev : curr,
		)

		// Construct the full path to the latest version file
		const latestFilePath = path.join(dirPath, latest!.file)

		// Read the file data
		const fileData = fs.readFileSync(latestFilePath)

		// Deserialize the data using msgpack
		return msgpack.decode(fileData)
	} catch (error) {
		// Log any errors during deserialization or file operations
		loggingErr({
			error: error instanceof Error ? error.message : 'Unknown error',
			context: 'loadMempool',
			warning: null,
			hint: 'Error loading mempool from storage',
			stack: error instanceof Error ? error.stack : new Error().stack,
			time: generateTimestampz(),
		})
		return null
	}
}
