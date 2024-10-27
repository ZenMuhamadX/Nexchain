import { showHeader } from 'cli(Development)/figlet/header'
import { askQuestion } from 'cli(Development)/question/askQuestion'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { transferFunds } from 'nexchain/transaction/transferFunds'

export const CLITransfer = async () => {
	showHeader('NexTransfer')
	console.log('Enter transaction details:')
	const receiver = await askQuestion({
		type: 'input',
		name: 'receiver',
		description: 'Receiver address',
		message: 'Enter receiver address',
	})
	const sender = await askQuestion({
		type: 'input',
		name: 'sender',
		description: 'Enter sender address',
		message: 'Enter sender address',
	})
	const amount = await askQuestion({
		type: 'input',
		name: 'amount',
		description: 'Enter amount to transfer',
		message: 'Enter amount',
	})
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
	const extraData = await askQuestion({
		type: 'input',
		name: 'extraData',
		description: 'Extra message for receiver optional',
		message: 'Enter extra message for receiver',
		default: '',
	})

	// Menampilkan detail transaksi untuk konfirmasi
	console.log('\nTransaction Details:')
	console.log(`- Sender: ${sender}`)
	console.log(`- Receiver: ${receiver}`)
	console.log(`- Amount: ${amount} ${format}`)
	console.log(`- Extra Message: ${extraData || 'N/A'}`)

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
		await transferFunds({
			amount,
			format,
			receiver,
			sender,
			timestamp,
			extraData,
		})
		console.log('Transaction successfully processed!')
	} else {
		console.log('Transaction cancelled.')
		process.exit(0) // Menghentikan aplikasi dengan status 0 (berhasil)
	}
}
