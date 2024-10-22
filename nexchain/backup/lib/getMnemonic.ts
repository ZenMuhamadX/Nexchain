import { readFileSync } from 'fs'
import { structWalletToSave } from 'interface/walletStructinf'
import path from 'path'

export const getMnemonicFromWallet = (walletName: string) => {
	const filePath = path.join(__dirname, `../../../wallet/${walletName}.json`)
	const data = readFileSync(filePath)
	const wallet: structWalletToSave = JSON.parse(data.toString())
	return wallet.mnemonic
}
