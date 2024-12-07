import { showHeader } from 'client/figlet/header'
import { askQuestion } from 'client/inquirer/askQuestion'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import fs from 'fs'
import path from 'path'
import { structWalletToSave } from 'interface/structWalletToSave'
import { sendTransactionToRpc } from 'client/transfer/sendTxToRpc'
import { createTransaction } from 'client/lib/createTransaction'

// Fungsi untuk membaca nama file wallet dari direktori
const getWalletFiles = (directory: string) => {
	const files = fs.readdirSync(directory)
	return files.filter((file) => file.endsWith('.json')) // Misalnya, file wallet dalam format JSON
}

const readWalletData = (filePath: string): structWalletToSave => {
	const data = fs.readFileSync(filePath, 'utf8')
	return JSON.parse(data) as structWalletToSave // Pastikan data di dalam file wallet valid JSON
}

export const CLITransfer = async () => {
	showHeader('NexTransfer')
	console.log('Enter transaction details:')

	// Ambil wallet dari direktori ../wallet
	const walletDirectory = path.join(__dirname, '../../wallet')
	const walletFiles = getWalletFiles(walletDirectory)

	if (walletFiles.length === 0) {
		console.log('No wallet files found in the directory.')
		process.exit(1)
	}

	// Membuat pilihan wallet dengan format { name, value }
	const walletChoices = walletFiles.map((file) => ({
		name: file, // Nama file sebagai pilihan
		value: file, // Nilai untuk dipilih
	}))

	const format = await askQuestion({
		type: 'list',
		name: 'format',
		description: 'Choice currency format for transfer. 1NXC = 1^18 nexu',
		choices: [
			{ name: 'NXC', value: 'NXC' },
			{ name: 'nexu', value: 'nexu' },
		],
		message: 'Choice your currency format',
		default: 'nexu',
	})

	const selectedWalletFile = await askQuestion({
		type: 'list', // Menggunakan tipe 'list' untuk memilih wallet
		name: 'wallet',
		description: 'Choose your wallet',
		message: 'Select a wallet file:',
		choices: walletChoices, // Menggunakan pilihan yang telah dibuat
	})

	const walletData = readWalletData(
		path.join(walletDirectory, selectedWalletFile),
	)
	const sender = walletData.address // Mengambil address dari walletData

	const receiver = await askQuestion({
		type: 'input',
		name: 'receiver',
		description: 'Receiver address',
		message: 'Enter receiver address',
	})

	const amount = await askQuestion({
		type: 'input',
		name: 'amount',
		description: 'Enter amount to transfer',
		message: 'Enter amount',
	})

	const fee = await askQuestion({
		type: 'input',
		name: 'fee',
		description: 'Enter fee for transaction in nexu format',
		message: 'Enter fee',
		default: 5000,
	})

	const extraMessage = await askQuestion({
		type: 'input',
		name: 'extraData',
		description: 'Extra message for receiver optional',
		message: 'Enter extra message for receiver',
		default: 'Nexchain transfer',
	})

	// Menampilkan detail transaksi untuk konfirmasi
	console.log('\nTransaction Details:')
	console.log(`- Sender: ${sender}`)
	console.log(`- Receiver: ${receiver}`)
	console.log(`- Amount: ${amount} ${format}`)
	console.log(`- Fee: ${fee} nexu`)
	console.log(`- Extra Message: ${extraMessage || 'N/A'}`)

	const confirm = await askQuestion({
		type: 'confirm',
		name: 'confirm',
		description: 'Confirm transaction',
		message: 'Do you want to proceed with the transaction? (y/n)',
		default: true,
	})

	// Jika konfirmasi adalah 'y', lanjutkan transaksi; jika tidak, batalkan
	if (confirm) {
		const timestamp = generateTimestampz()
		const txData = createTransaction({
			amount,
			format,
			receiver,
			sender,
			timestamp,
			extraMessage,
			fee,
		})
		if (!txData.status) {
			console.log('Transaction failed')
			process.exit(1)
		}
		await sendTransactionToRpc(txData.rawData!)
		console.log('Transaction sent successfully!')
	} else {
		console.log('Transaction cancelled.')
		process.exit(0) // Menghentikan aplikasi dengan status 0 (berhasil)
	}
}
