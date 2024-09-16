import 'dotenv/config'
import { getKeyPair } from '../hash/getKeyPair'
import { generateTimestampz } from '../timestamp/generateTimestampz'
import crypto from 'crypto'
import { BSON } from 'bson'
import path from 'path'
import fs from 'fs'
import { encryptPrivateKey } from './secure/encrypt/encrypt'
import { structWalletToSave } from '../../model/interface/walletStructinf.'

export const saveWallet = (wallet: string) => {
	try {
		// const securePrivateKey = encryptPrivateKey(
		// 	getKeyPair().privateKey,
		// 	process.env.PASSWORD_WALLET!,
		// )
		const structToSave: structWalletToSave = {
			data: {
				wallet: wallet,
				publicKey: getKeyPair().publicKey,
				privateKey: getKeyPair().privateKey
			},
			metadata: {
				timestamp: generateTimestampz(),
				label: 'Main wallet',
			},
			// authTag: securePrivateKey.authTag,
			// iv: securePrivateKey.iv,
		}
		structToSave.checkSum = addCheckSum(structToSave)

		// Serialize blockData ke dalam format binary
		const serializeBlock = BSON.serialize(structToSave)

		// Dapatkan nama file untuk menyimpan block
		const fileName = 'MainWallet'

		// Tentukan path file (opsional, jika ingin menyimpan di direktori tertentu)
		const dirPath = path.join(__dirname, '../../../wallet')
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

const addCheckSum = (data: any) => {
	const formatData = JSON.stringify(data)
	return crypto
		.createHash('sha512')
		.update(Buffer.from(formatData))
		.digest('hex')
}
