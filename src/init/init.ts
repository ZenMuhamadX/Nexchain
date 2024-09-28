import path from 'path'
import { getKeyPair } from '../lib/hash/getKeyPair'
import { saveConfigFile } from '../storage/saveConfig'
import { writeFileSync } from 'fs'

export const init = (): void => {
	console.log('Initializing...')
	const filePath = path.join(__dirname, '../../.env')
	writeFileSync(filePath, 'WALLET_PASSWORD = root\n')
	getKeyPair()
	saveConfigFile()
}
init()
