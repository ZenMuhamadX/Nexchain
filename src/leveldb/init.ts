import { existsSync, mkdirSync } from 'fs'
import { Level } from 'level'
import path from 'path'

const dirPath = path.join(__dirname, '../../leveldb_base')
if (!existsSync(dirPath)) {
	mkdirSync(dirPath)
}

export const leveldb = new Level<string, any>(dirPath, {
	valueEncoding: 'json', // Store values in JSON format for easy handling
	keyEncoding: 'utf-8', // Use UTF-8 encoding for keys
	cacheSize: 1024 * 1024 * 4, // 4 MB cache to improve data access speed
	writeBufferSize: 4 * 1024 * 1024, // 4 MB write buffer for more efficient batch writes
	blockSize: 1024 * 8, // 8 KB block size for optimal read/write performance
	compression: true, // Enable compression to save storage space
	blockRestartInterval: 16, // Block restart interval for balanced performance
	createIfMissing: true, // Create the database if it does not exist
	maxOpenFiles: 1000, // Allow a maximum of 1000 open files
	maxFileSize: 1024 * 1024 * 1024, // Set maximum file size to 1 GB
	multithreading: true, // Enable multithreading for increased throughput
	errorIfExists: true, // Throw an error if the database already exists
	prefix: 'leveldb-blockchain', // Prefix for organizing database files
	version: 1, // Set database version
})
