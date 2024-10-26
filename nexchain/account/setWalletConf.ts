import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { WalletConfig } from 'interface/walletConfig'
import { convertTimestampToDate } from 'nexchain/lib/timestamp/convertTimestamp'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import path from 'path'

export const setWalletConfig = () => {
	const dirPath = path.join(__dirname, '../../config/')
	const filePath = path.join(dirPath, 'wallet.conf.json')
	if (!existsSync(dirPath)) {
		mkdirSync(dirPath, { recursive: true })
	}
	const defaultData: WalletConfig = {
		createdAt: convertTimestampToDate(generateTimestampz()),
		isBackup: false,
		primaryWalletName: 'main',
		network: 'Devnet',
	}
	writeFileSync(filePath, JSON.stringify(defaultData, null, 2))
}