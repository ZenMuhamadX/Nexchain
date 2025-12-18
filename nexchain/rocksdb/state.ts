import path from 'path'
import { initFile } from './init'
import { Level } from 'level'

initFile()
const dirPath = path.join(__dirname, '../../base/state')

export const rocksState = new Level(dirPath, {
	valueEncoding: 'json', // Store state data in JSON format
	keyEncoding: 'utf-8', // Use UTF-8 encoding for keys
	cacheSize: 16 * 1024 * 1024, // 16 MB cache for fast access to balances and state
	writeBufferSize: 16 * 1024 * 1024, // 16 MB write buffer for efficient batch writes
	blockSize: 16384, // Block size (16 KB) for efficient reads/writes
	compression: false, // Disable compression for faster access times
	createIfMissing: true, // Create the database if it does not exist
	errorIfExists: false, // Do not error if the database already exists
	maxOpenFiles: 2048, // Maximum of 2048 open files
	maxFileSize: 1024 * 1024 * 1024, // Set maximum file size to 1 GB
	blockRestartInterval: 16, // Block restart interval
	multithreading: false, // Disable multithreading for stability
	prefix: 'leveldb-State', // Prefix for keys
	version: '^8.0.0', // Version of LevelDB being used
})
