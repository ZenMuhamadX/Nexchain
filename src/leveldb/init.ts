import { existsSync, mkdirSync } from 'fs'
import { Level } from 'level'
import path from 'path'

const dirPath = path.join(__dirname, '../../base')
if (!existsSync(dirPath)) {
	mkdirSync(dirPath)
}

export const leveldb = new Level<string, any>(dirPath, {
	valueEncoding: 'json', // Store values in JSON format
	keyEncoding: 'utf-8', // Use UTF-8 encoding for keys
	cacheSize: 4 * 1024 * 1024, // 4 MB cache to improve data access speed
	writeBufferSize: 4 * 1024 * 1024, // 4 MB write buffer for efficient batch writes
	blockSize: 8192, // Block size (8 KB)
	compression: false, // Disable compression for performance
	createIfMissing: true, // Create the database if it does not exist
	errorIfExists: false, // Do not error if the database already exists
	maxOpenFiles: 1000, // Maximum of 1000 open files
	maxFileSize: 1024 * 1024 * 1024, // Set maximum file size to 1 GB
	blockRestartInterval: 16, // Block restart interval
	multithreading: true, // Enable multithreading for better performance
	prefix: 'leveldb-NexChains', // Prefix for keys
})
