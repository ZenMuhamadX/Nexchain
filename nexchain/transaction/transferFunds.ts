import { createTxnHash } from 'nexchain/transaction/createTxHash'
import { comTxInterface } from 'interface/structComTx'
import { MemPool } from 'nexchain/model/memPool/memPool'
import { TxInterface } from 'interface/structTx'
import { loadWallet } from 'nexchain/account/utils/loadWallet'
import { stringToHex } from 'nexchain/hex/stringToHex'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { toNxc } from 'nexchain/nexucoin/toNxc'
import { createSignature } from 'nexchain/sign/createSignature'

export const transferFunds = async (transaction: comTxInterface) => {
	const memPool = new MemPool()
	let convertedAmount = transaction.amount

	// Konversi amount ke Nexu jika formatnya adalah NXC
	if (transaction.format === 'NXC') {
		convertedAmount = toNexu(transaction.amount)
	}

	// Cek apakah jumlah minimal 1 Nexu terpenuhi
	const minAmount = 1 // Minimum 1 Nexu
	if (convertedAmount < minAmount) {
		console.log('Transaction amount must be at least 1 nexu.')
		return // Hentikan eksekusi jika tidak memenuhi syarat
	}

	// Hitung fee hanya jika jumlah yang ditransfer lebih dari atau sama dengan 1 NXC (10^18 Nexu)
	let fee = 0
	let amountAfterFee = convertedAmount

	if (convertedAmount >= Math.pow(10, 18)) {
		// Batas untuk 1 NXC
		const feePercentage = 0.0001
		fee = convertedAmount * feePercentage
		amountAfterFee = convertedAmount - fee
	}

	// Buat objek transaksi
	const convertedTx: TxInterface = {
		format: 'nexu',
		amount: amountAfterFee,
		receiver: transaction.receiver,
		sender: transaction.sender,
		timestamp: transaction.timestamp,
		fee: toNxc(fee),
		isPending: true,
		isValid: false,
		extraData: stringToHex(
			transaction.extraData ||
				'NexChains A Next Generation Blockchain for Everyone',
		),
		status: 'pending',
		sign: { r: '', s: '', v: 0 },
	}

	// Ambil privateKey dari wallet
	const { privateKey } = loadWallet()!
	convertedTx.txHash = createTxnHash(convertedTx)
	convertedTx.sign = createSignature(convertedTx.txHash!, privateKey)

	const hexInput = stringToHex(
		JSON.stringify({
			format: convertedTx.format,
			amount: convertedTx.amount,
			receiver: convertedTx.receiver,
			sender: convertedTx.sender,
			timestamp: convertedTx.timestamp,
		}),
	)
	convertedTx.hexInput = hexInput

	// Tambahkan transaksi ke mempool
	const added = await memPool.addTransaction(convertedTx)
	console.log(
		added
			? 'Transaction added successfully, waiting for confirmation.'
			: 'Failed to add transaction.',
	)
}
