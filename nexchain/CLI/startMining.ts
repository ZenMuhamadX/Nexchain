import { askQuestion } from 'client/question/askQuestion'
import { mineBlock } from 'nexchain/miner/mining'

export const CLIMining = async () => {
	// Meminta alamat dari pengguna
	const address = await askQuestion({
		message: 'Enter your address',
		name: 'address',
		type: 'input',
		description: 'Enter address for receiver reward',
	})

	console.log('Mining dimulai dengan alamat:', address)

	let isMining = true // Flag untuk mengontrol proses mining

	// Menangani Ctrl + C
	process.on('SIGINT', async () => {
		isMining = false
		console.log('\nProses mining dihentikan sementara...')

		const confirmation = await askQuestion({
			message: 'Apakah Anda yakin ingin menghentikan mining dan keluar?',
			name: 'confirmExit',
			type: 'confirm',
		})

		if (confirmation.confirmExit) {
			console.log('Mining dihentikan. Keluar dari aplikasi.')
			process.exit()
		} else {
			console.log('Melanjutkan proses mining...')
			isMining = true
		}
	})

	// Loop asinkron untuk mining
	while (isMining) {
		await mineBlock(address) // Menunggu hingga miningBlock selesai sebelum memulai lagi
	}
}
