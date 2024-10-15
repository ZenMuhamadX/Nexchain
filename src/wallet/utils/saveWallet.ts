import 'dotenv/config'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import { encrypt } from '../secure/encrypt/encrypt'
import { getKeyPair } from 'src/lib/hash/getKeyPair'
import { loadConfig } from 'src/storage/conf/loadConfig'
import { structWalletToSave } from 'src/model/interface/walletStructinf'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import msg from 'msgpack-lite'

// Saves the main wallet data to a file
export const saveMainWallet = async (
	wallet: string,
	privateKey: string = getKeyPair().privateKey,
): Promise<boolean> => {
	try {
		const password = process.env.WALLET_PASSWORD as string
		// Encrypt the private key
		const encryptedPrivateKey = encrypt(privateKey, password)

		// Determine the file name and path
		const dirPath = path.join(__dirname, '../../../myWallet')
		const filePath = loadConfig()?.wallet.path as string

		// Create directory if it does not exist
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true })
		}

		// Prepare the data to be saved
		const structToSave: structWalletToSave = {
			data: {
				address: wallet,
				publicKey: getKeyPair().publicKey,
				encryptPrivateKey: encryptedPrivateKey as string,
				decryptPrivateKey: privateKey,
			},
			metadata: {
				timestamp: generateTimestampz(),
				label: 'Main wallet',
			},
		}
		structToSave.checkSum = addCheckSum(structToSave)

		// Serialize the data and write to file
		const serializedData = msg.encode(structToSave)

		fs.writeFileSync(filePath, serializedData, 'binary')

		console.log('Wallet saved successfully.', filePath)

		return true
	} catch (error) {
		// Handle errors that occur during the saving process
		console.error('Error saving wallet:', error)
		return false
	}
}

// Adds a checksum to the data for integrity verification
const addCheckSum = (data: any) => {
	try {
		const formatData = JSON.stringify(data)
		return crypto
			.createHash('sha512')
			.update(Buffer.from(formatData))
			.digest('hex')
	} catch (error) {
		console.error('Error generating checksum:', error)
		throw error // Re-throw to allow calling functions to handle it
	}
}
