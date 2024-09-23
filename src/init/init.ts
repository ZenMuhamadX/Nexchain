import path from 'path'
import { getKeyPair } from '../lib/hash/getKeyPair'
import { saveConfigFile } from '../lib/utils/saveConfig'
import { writeFileSync } from 'fs'
import { saveStateVersion } from 'src/model/memPool/utils/saveStateVer'

export const init = (): void => {
	console.log('Initializing...')
	const filePath = path.join(__dirname, '../../.env')
	writeFileSync(filePath, 'WALLET_PASSWORD = root\n')
	getKeyPair()
	saveConfigFile()
	saveStateVersion()
}
init()