import fs from 'fs'
import path from 'path'

const createDirectoryIfNotExists = (dirPath: string) => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath)
	}
}

export const initFile = () => {
	const baseDir = path.join(__dirname, '../../base')
	const memPool = path.join(baseDir, 'memPool')
	const history = path.join(baseDir, 'history')
	const state = path.join(baseDir, 'state')

	// Membuat direktori jika belum ada
	createDirectoryIfNotExists(baseDir)
	createDirectoryIfNotExists(memPool)
	createDirectoryIfNotExists(history)
	createDirectoryIfNotExists(state)
}
