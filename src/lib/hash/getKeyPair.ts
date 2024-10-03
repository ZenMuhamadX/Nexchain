/** @format */

import * as fs from 'fs'
import * as path from 'path'
import { ec as EC } from 'elliptic'
import { stringToBinary } from '../bin/stringToBinary'
import { generateSeedFromMnemonic } from 'src/backup/mnemonic/createSeedFromMnemonic'
import { generatePhrase } from 'src/backup/mnemonic/generatePhrase'

// Buat instance dari kurva ECC
const ec = new EC('secp256k1') // Anda dapat memilih kurva lain jika diinginkan

// Fungsi untuk menghasilkan pasangan kunci ECC atau membacanya dari file
export const getKeyPair = (): {
	publicKey: string
	privateKey: string
	mnemonic: string
} => {
	const entropy = generateSeedFromMnemonic(generatePhrase())
	// Tentukan path file kunci
	const publicKeyPath = path.join(__dirname, '../../../key/public.pem')
	const privateKeyPath = path.join(__dirname, '../../../key/private.pem')
	const mnemonicPath = path.join(__dirname, '../../../key/mnemonic.bin')
	const warnigPath = path.join(__dirname, '../../../key/WARNING.txt')

	// Cek apakah file kunci sudah ada
	if (
		fs.existsSync(publicKeyPath) &&
		fs.existsSync(privateKeyPath) &&
		fs.existsSync(mnemonicPath)
	) {
		// Membaca kunci dari file
		const publicKey = fs.readFileSync(publicKeyPath, 'utf8')
		const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
		const mnemonic = fs.readFileSync(mnemonicPath, 'utf8')
		return { publicKey, privateKey, mnemonic }
	} else {
		// Menghasilkan pasangan kunci ECC baru
		const keyPair = ec.genKeyPair({ entropy: Buffer.from(entropy.seed, 'hex') })
		const publicKey = keyPair.getPublic('hex')
		const privateKey = keyPair.getPrivate('hex')

		// Pastikan direktori target ada
		const keyDir = path.dirname(publicKeyPath)
		if (!fs.existsSync(keyDir)) {
			fs.mkdirSync(keyDir, { recursive: true })
		}

		const binaryMnemonic = stringToBinary(entropy.mnemonic)

		// Menyimpan kunci ke file
		fs.writeFileSync(publicKeyPath, publicKey)
		fs.writeFileSync(privateKeyPath, privateKey)
		fs.writeFileSync(mnemonicPath, binaryMnemonic)
		fs.writeFileSync(
			warnigPath,
			`WARNING: DO NOT SHARE ANYTHING IN THIS FILE WITH ANYONE,
			 DO NOT REMOVE THIS FILE OR ANY FILES IN IT. THIS FILE IS FOR INTERNAL USE ONLY.
			 IF YOU REMOVE THIS FILE OR ANY FILES IN IT, YOU WILL LOSE ALL YOUR WALLET DATA.
			`,
		)
		return { publicKey, privateKey, mnemonic: entropy.mnemonic }
	}
}
