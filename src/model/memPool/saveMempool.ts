import fs from 'node:fs'
import path from 'node:path'
import { getNextMempoolVersion } from './utils/getNextVer'
import { MemPoolInterface } from '../interface/memPool.inf'
import { loggingErr } from '../../logging/errorLog'
import { generateTimestampz } from '../../lib/timestamp/generateTimestampz'
import { removeOldVersions } from './utils/removeOldVer'
import msgpack from 'msgpack-lite'

export const saveMempool = (mempool: MemPoolInterface | MemPoolInterface[]) => {
	try {
		// Get the next version number
		const version = getNextMempoolVersion()

		// Determine the file path
		const dirPath = path.join(__dirname, '../../../mempool_versions')
		const filePath = path.join(dirPath, `mempool_v${version}.bin`)

		// Create the directory if it doesn't exist
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true })
		}

		// Try to create a BSON buffer from the mempool
		const buffer = msgpack.encode(mempool)

		// Try to write the buffer to the file
		fs.writeFileSync(filePath, buffer)
		removeOldVersions()
	} catch (error: any) {
		loggingErr({
			error: error.message || error,
			context: 'Save MemPool',
			hint: 'Error saving mempool to file',
			warning:null,
			stack: new Error().stack,
			time: generateTimestampz(),
		})
	}
}
