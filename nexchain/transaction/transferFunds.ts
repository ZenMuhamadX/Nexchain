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

	// Jika format adalah NXC, konversi amount menggunakan toNexu
	if (transaction.format === 'NXC') {
		convertedAmount = toNexu(transaction.amount)
	}

	// Cek apakah jumlah minimal terpenuhi
	const minAmount = toNexu(1) // Minimum 1 nexu
	if (convertedAmount < minAmount) {
		console.log('Transaction amount must be at least 2 NXC.')
		return // Hentikan eksekusi jika tidak memenuhi syarat
	}

	// Hitung fee 0.01%
	const feePercentage = 0.0001
	const fee = convertedAmount * feePercentage

	// Hitung jumlah yang akan ditransfer setelah dikurangi fee
	const amountAfterFee = convertedAmount - fee

	// Buat objek transaksi
	const convertedTx: TxInterface = {
		format: 'nexu',
		amount: amountAfterFee, // Amount setelah dikurangi fee
		receiver: transaction.receiver,
		sender: transaction.sender,
		timestamp: transaction.timestamp,
		fee: toNxc(fee), // Menyimpan fee sebagai bagian dari transaksi
		isPending: true,
		isValid: false,
		extraData: stringToHex(
			transaction.extraData ||
				'NexChains A Next Generation Blockchain for Everyone',
		),
		status: 'pending',
		sign: {
			r: '',
			s: '',
			v: 0,
		},
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
