import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { structWalletToSave } from 'interface/structWalletToSave'
import path from 'path'
import readline from 'readline'

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

// Fungsi untuk menangani penekanan Ctrl+C
const handleExit = () => {
	console.log('\nExiting...')
	rl.close()
	process.exit()
}

process.on('SIGINT', handleExit)

const askYesNo = (question: string, callback: CallableFunction) => {
	rl.question(question, (answer) => {
		answer = answer.toLowerCase()
		if (answer === 'yes') {
			callback(true)
		} else if (answer === 'no') {
			callback(false)
		} else {
			console.log('Say what? Please answer with yes or no.')
			askYesNo(question, callback) // Rekursi untuk mengulangi pertanyaan
		}
	})
}

export const saveWallet = (data: structWalletToSave, fileName: string) => {
	const dirPath = path.join(__dirname, '../../../wallet/')
	const filePath = path.join(dirPath, `${fileName}.json`)

	try {
		if (!existsSync(dirPath)) {
			mkdirSync(dirPath, { recursive: true })
		}

		if (existsSync(filePath)) {
			askYesNo(
				'Wallet already exists. Do you want to overwrite it? (yes/no) ',
				(overwrite: string) => {
					if (overwrite) {
						writeFileSync(filePath, JSON.stringify(data, null, 2))
						console.log(`Wallet saved to ${filePath}`)
					} else {
						console.log('Wallet not saved.')
					}
					rl.close()
				},
			)
		} else {
			askYesNo(
				`Wallet does not exist. Do you want to create a new wallet with the name "${fileName}"? (yes/no) `,
				(create: string) => {
					if (create) {
						writeFileSync(filePath, JSON.stringify(data, null, 2))
						console.log(`Wallet created and saved to ${filePath}`)
					} else {
						console.log('No wallet created.')
					}
					rl.close()
				},
			)
		}
	} catch (error) {
		console.error('Error saving wallet:', error)
		rl.close()
	}
}
