import { createTxnHash } from 'nexchain/transaction/createTxHash'
import { comTxInterface } from 'interface/structComTx'
import { MemPool } from 'nexchain/model/memPool/memPool'
import { TxInterface } from 'interface/structTx'
import { loadWallet } from 'nexchain/account/utils/loadWallet'
import { stringToHex } from 'nexchain/hex/stringToHex'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { createSignature } from 'nexchain/sign/createSignature'
import { isContract } from 'nexchain/lib/isContract'

export const transferFunds = async (
	transaction: comTxInterface,
): Promise<{ status: boolean; txHash?: string | undefined }> => {
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
		return { status: false, txHash: undefined } // Hentikan eksekusi jika tidak memenuhi syarat
	}
	const fee: number = transaction.fee!
	const amountAfterFee = convertedAmount - fee! // Menghitung biaya transaksi
	const isReceiverContract = isContract(transaction.receiver)
	const isSenderContract = isContract(transaction.sender)

	// Buat objek transaksi
	const convertedTx: TxInterface = {
		format: 'nexu',
		amount: amountAfterFee,
		receiver: transaction.receiver,
		sender: transaction.sender,
		timestamp: transaction.timestamp,
		fee: transaction.fee!,
		isPending: true,
		isValid: false,
		extraData:
			transaction.extraData ||
			'NexChains A Next Generation Blockchain for Everyone',
		status: 'pending',
		isContractTx: isSenderContract || isReceiverContract,
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
			isContractTx: convertedTx.isContractTx,
		}),
	)
	convertedTx.hexInput = hexInput

	// Tambahkan transaksi ke mempool
	const added = await memPool.addTransaction(convertedTx)
	if (!added) return { status: false, txHash: undefined }
	console.log('Transaction added to mempool waiting for mined')
	return { status: true, txHash: convertedTx.txHash }
}
