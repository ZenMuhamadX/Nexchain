import { getKeyPair } from '../lib/hash/getKeyPair'

export const init = (): void => {
	console.log('Initializing...')
	getKeyPair()
}
init()
