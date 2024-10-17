import { getKeyPair } from '../lib/hash/getKeyPair'
import { saveConfigFile } from '../storage/conf/saveConfig'

export const init = (): void => {
	console.log('Initializing...')
	getKeyPair()
	saveConfigFile()
}
init()
