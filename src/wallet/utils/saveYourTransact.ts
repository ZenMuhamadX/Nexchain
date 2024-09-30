import path from 'path'
import fs from 'fs'
import { getHistoryByAddress } from 'src/block/query/direct/getHistoryByAddress'
import { myWalletAddress } from '../myWalletAddress'

// Determine the file name and path
const dirPath = path.join(__dirname, '../../../history')
const filePath = path.join(dirPath, 'history.json')

export const saveHistory = () => {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
	const history = getHistoryByAddress(myWalletAddress())
	fs.writeFileSync(filePath, JSON.stringify(history, null, 2))
}
