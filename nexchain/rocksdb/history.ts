import path from 'path'
import { initFile } from './init'
import levelup from 'levelup'
import RocksDB from 'rocksdb'

initFile()
const dirPath = path.join(__dirname, '../../base/history')

export const rocksHistory = levelup(RocksDB(dirPath), {
	valueEncoding: 'utf-8', // Store transaction data in JSON format
	keyEncoding: 'utf-8', // Use UTF-8 encoding for keys
	cacheSize: 4 * 1024 * 1024, // 4 MB cache to improve write performance
	writeBufferSize: 16 * 1024 * 1024, // 16 MB write buffer for efficient batch writes
	blockSize: 16384, // Block size (16 KB) for handling writes efficiently
	compression: false, // Disable compression for faster writes
	createIfMissing: true, // Create the database if it does not exist
	errorIfExists: false, // Do not error if the database already exists
	maxOpenFiles: 2048, // Maximum of 2048 open files
	maxFileSize: 1024 * 1024 * 1024, // Set maximum file size to 1 GB
	blockRestartInterval: 16, // Block restart interval
	multithreading: false, // Disable multithreading for stability
	prefix: 'leveldb-TransactionHistory', // Prefix for keys
	version: '^8.0.0', // Version of LevelDB being used
})
