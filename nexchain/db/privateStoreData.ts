import path from 'path'
import { initFile } from './init'
import RocksDB from 'rocksdb'
import levelup from 'levelup'

initFile()
const dirPath = path.join(__dirname, '../../base/storeData')

export const rocksStoreData = levelup(RocksDB(dirPath), {
	valueEncoding: 'json', // Store transaction data in JSON format
	keyEncoding: 'utf-8', // Use UTF-8 encoding for keys
	cacheSize: 8 * 1024 * 1024, // 8 MB cache for fast access to transactions
	writeBufferSize: 16 * 1024 * 1024, // 16 MB write buffer for efficient batch writes
	blockSize: 16384, // Block size (16 KB) for handling multiple transactions
	compression: false, // Disable compression for better write performance
	createIfMissing: true, // Create the database if it does not exist
	errorIfExists: false, // Do not error if the database already exists
	maxOpenFiles: 2048, // Maximum of 2048 open files
	maxFileSize: 1024 * 1024 * 1024, // Set maximum file size to 1 GB
	blockRestartInterval: 16, // Block restart interval
	multithreading: false, // Disable multithreading for stability
	prefix: 'leveldb-Mempool', // Prefix for keys
	version: '^8.0.0', // Version of LevelDB being used
})
