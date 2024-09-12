/** @format */

import fs from 'fs'
import path from 'path'

const directoryPath = path.resolve(__dirname, '../../../blocks')

const getLastBlockNumber = () => {
	const files = fs.readdirSync(directoryPath)
	const blockNumbers = files
		.filter((file) => file.startsWith('blk') && file.length > 7)
		.map((file) => parseInt(file.substring(3, 10), 10))
		.sort((a, b) => b - a)

	return blockNumbers.length > 0 ? blockNumbers[0] : 0
}

export const createBlockName = (): string => {
	const lastNum = getLastBlockNumber()
	const nextNum = lastNum + 1
	const numDigits = 7 // Ganti sesuai panjang yang diinginkan
	const formattedNum = nextNum.toString().padStart(numDigits, '0')
	return `blk${formattedNum}`
}
