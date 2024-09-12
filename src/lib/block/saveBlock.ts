/** @format */

import fs from 'fs'
import { Block } from '../../model/blocks/Block'
import path from 'path'
import { serializeBlockToBinary } from '../utils/serialize'
import { createBlockName } from '../utils/createBlockName'

// Fungsi untuk menyimpan Block ke dalam file
export const saveBlock = (blockData: Block): boolean => {
	try {
		// Serialize blockData ke dalam format binary
		const serializeBlock = serializeBlockToBinary(blockData)

		// Dapatkan nama file untuk menyimpan block
		const fileName = createBlockName()

		// Tentukan path file (opsional, jika ingin menyimpan di direktori tertentu)
		const dirPath = path.join(__dirname, '../../../blocks')
		const filePath = path.join(dirPath, `${fileName}.bin`)

		// Membuat direktori jika belum ada
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true })
		}

		// Tulis Buffer ke dalam file dengan nama yang dihasilkan
		fs.writeFileSync(filePath, serializeBlock, 'binary')
		return true
	} catch (error) {
		// Tangani error jika proses penyimpanan gagal
		console.error('Error saving block:', error)
		return false
	}
}
