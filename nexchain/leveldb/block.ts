import { Level } from 'level'
import path from 'path'
import { initFile } from './init'

initFile()
const dirPath = path.join(__dirname, '../../base')

export const leveldb = new Level<string, any>(dirPath, {
	valueEncoding: 'utf-8', // Store values in JSON format
	keyEncoding: 'utf-8', // Use UTF-8 encoding for keys
	cacheSize: 8 * 1024 * 1024, // 8 MB cache to improve data access speed
	writeBufferSize: 16 * 1024 * 1024, // 16 MB write buffer for efficient batch writes
	blockSize: 16384, // Block size (16 KB) for handling heavy queries
	compression: false, // Disable compression for better performance
	createIfMissing: true, // Create the database if it does not exist
	errorIfExists: false, // Do not error if the database already exists
	maxOpenFiles: 2048, // Maximum of 2048 open files
	maxFileSize: 1024 * 1024 * 1024, // Set maximum file size to 1 GB
	blockRestartInterval: 16, // Block restart interval
	multithreading: false, // Disable multithreading for stability
	prefix: 'leveldb-block', // Prefix for keys
	version: '^8.0.0', // Version of LevelDB being used
})
