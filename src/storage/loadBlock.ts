/** @format */

import { Block } from '../model/blocks/block'
import fs from 'node:fs'
import path from 'node:path'
import { deserializeBlockFromBinary } from '../lib/utils/deserialize'
import { loggingErr } from '../logging/errorLog'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'

export const loadBlocks = (): Block[] | false => {
	const dirPath = path.join(__dirname, '../../../blocks')

	try {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath)
		}

		// Membaca semua file dalam direktori
		const files = fs.readdirSync(dirPath)

		if (files.length === 0) {
			return false
		}

		// Filter file yang berawalan 'blk' dan berformat .bin
		const blockFiles = files.filter(
			(file) => file.startsWith('blk') && file.endsWith('.bin'),
		)

		// Array untuk menyimpan semua block
		const blocks: Block[] = []

		// Membaca dan mendeserialisasi setiap file
		blockFiles.map((file) => {
			const filePath = path.join(dirPath, file)
			const blockBuffer = fs.readFileSync(filePath)
			const block = deserializeBlockFromBinary(blockBuffer)
			blocks.push(block)
		})

		// Mengurutkan blok berdasarkan index
		blocks.sort((a, b) => a.blk.height - b.blk.height)

		return blocks
	} catch (error) {
		loggingErr({
			error: error,
			stack: new Error().stack,
			context: 'loadBlocks',
			hint: 'Error loading blocks from storage',
			warning: null,
			time: generateTimestampz(),
		})
		return false
	}
}
