import { createTxnHash } from 'nexchain/transaction/createTxHash'
import { comTxInterface } from 'interface/structComTx'
import { TxInterface } from 'interface/structTx'
import { stringToHex } from 'nexchain/hex/stringToHex'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { isContract } from 'nexchain/lib/isContract'
import { loadWallet } from 'account/utils/loadWallet'
import { createSignature } from 'sign/createSign'
import { encodeTx } from 'nexchain/hex/tx/encodeTx'

export interface returnData {
	status: boolean
	txHash?: string | undefined
	base64Data: string | undefined
	rawData: TxInterface | undefined
}

export const createTransaction = (transaction: comTxInterface): returnData => {
	let convertedAmount = transaction.amount

	// Konversi amount ke Nexu jika formatnya adalah NXC
	if (transaction.format === 'NXC') {
		convertedAmount = toNexu(transaction.amount)
	}

	// Cek apakah jumlah minimal 1 Nexu terpenuhi
	const minAmount = 1 // Minimum 1 Nexu
	if (convertedAmount < minAmount) {
		console.log('Transaction amount must be at least 1 nexu.')
		return {
			status: false,
			txHash: undefined,
			base64Data: undefined,
			rawData: undefined,
		} // Hentikan eksekusi jika tidak memenuhi syarat
	}

	const isReceiverContract = isContract(transaction.receiver)

	const isSenderContract = isContract(transaction.sender)

	// Buat objek transaksi
	const completedTx: TxInterface = {
		format: 'nexu',
		amount: convertedAmount,
		receiver: transaction.receiver,
		sender: transaction.sender,
		timestamp: transaction.timestamp,
		fee: transaction.fee!,
		isPending: true,
		isValid: false,
		extraMessage:
			transaction.extraMessage ||
			'NexChains A Next Generation Blockchain for Everyone',
		status: 'pending',
		isReceiverContract,
		isSenderContract,
		sign: { r: '', s: '', v: 0 },
	}

	// Ambil privateKey dari wallet
	const { privateKey } = loadWallet()!
	completedTx.txHash = createTxnHash(completedTx)
	completedTx.sign = createSignature(completedTx.txHash!, privateKey)

	completedTx.hexInput = stringToHex(
		JSON.stringify({
			format: completedTx.format,
			amount: completedTx.amount,
			receiver: completedTx.receiver,
			sender: completedTx.sender,
			timestamp: completedTx.timestamp,
		}),
	)
	const base64Data = encodeTx(completedTx)
	return {
		status: true,
		txHash: completedTx.txHash,
		base64Data,
		rawData: completedTx,
	}
}