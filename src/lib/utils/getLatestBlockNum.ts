import { readdirSync } from 'fs'
import path from 'path'

const directoryPath = path.resolve(__dirname, '../../../blocks')
export const getLastBlockNumber = () => {
	const files = readdirSync(directoryPath)
	const blockNumbers = files
		.filter((file) => file.startsWith('blk') && file.length > 7)
		.map((file) => parseInt(file.substring(3, 10), 10))
		.sort((a, b) => b - a)

	return blockNumbers.length > 0 ? blockNumbers[0] : 0
}
