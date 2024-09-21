import { getKeyPair } from '../lib/hash/getKeyPair'
import { saveConfigFile } from '../lib/utils/saveConfig'
import { createWalletAddress } from '../lib/wallet/createWallet'

export const init = ():void => {
	getKeyPair()
    saveConfigFile()
	createWalletAddress()
}

init()