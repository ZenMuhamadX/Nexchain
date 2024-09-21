import path from 'path'
import fs from 'fs'

export const saveStateVersion = (): void => {
	const dirPath = path.join(__dirname, '../../../../config')
	const filePath = path.join(dirPath, 'statePool.config.json')

	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath)
	}

	const defaultConfig = {
		poolVersion: 1,
	}

	fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 4))
}
