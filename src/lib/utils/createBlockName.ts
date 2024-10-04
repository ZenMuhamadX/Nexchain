/** @format */

import { getLastBlockNumber } from "./getLatestBlockNum"

export const createBlockName = (): string => {
	const lastNum = getLastBlockNumber()
	const nextNum = lastNum! + 1
	const numDigits = 7 // Ganti sesuai panjang yang diinginkan
	const formattedNum = nextNum.toString().padStart(numDigits, '0')
	return `blk${formattedNum}`
}
