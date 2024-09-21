import path from 'path'
import fs from 'fs'
import { saveStateVersion } from './saveStateVer'

export const loadStateVersion = (): number => {
	const dirPath = path.join(__dirname, '../../../../config')
	const filePath = path.join(dirPath, 'statePool.config.json')
	if (!fs.existsSync(dirPath) || !fs.existsSync(filePath)) {
		saveStateVersion()
	}
	const files = fs.readFileSync(filePath, 'utf-8')
	const state = JSON.parse(files)
	return state.poolVersion
}
