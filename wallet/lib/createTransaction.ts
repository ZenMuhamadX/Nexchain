import { createTxnHash } from 'nexchain core/transaction/createTxHash'
import { stringToHex } from 'nexchain core/hex/stringToHex'
import { toNexu } from 'nexchain core/nexucoin/toNexu'
import { isContract } from 'nexchain core/lib/isContract'
import { loadWallet } from 'libAccount/utils/loadWallet'
import { createSignature } from 'wallet/sign/createSign'
import { encodeTx } from 'nexchain core/hex/tx/encodeTx'
import { logToConsole } from 'logging/logging'
import { generateKeysFromMnemonic } from 'wallet/key/genKeyFromMnemonic'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { stringToBigInt } from 'nexchain core/loaders/lib/stringToBigint'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'
import { comTxInterfaceCore } from 'interface/core/structComTxCore'

export interface returnData {
	status: boolean
	txHash?: string | undefined
	base64Data: string | undefined
	rawData: TxInterfaceCore | undefined
}

export const createTransaction = (
	transaction: comTxInterfaceCore,
): returnData => {
	let convertedAmount = stringToBigInt(transaction.amount)

	// Konversi amount ke Nexu jika formatnya adalah NXC
	if (transaction.format === 'NXC') {
		convertedAmount = toNexu(transaction.amount.toString())
	}

	// Cek apakah jumlah minimal 1 Nexu terpenuhi
	const minAmount = 1n // Minimum 1 Nexu
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
	const completedTx: TxInterfaceCore = {
		format: 'nexu',
		amount: convertedAmount,
		receiver: transaction.receiver,
		sender: transaction.sender,
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
	const { phrase } = loadWallet()!
	const { privateKey } = generateKeysFromMnemonic(phrase)
	completedTx.txHash = createTxnHash(completedTx)
	completedTx.sign = createSignature(completedTx.txHash!, privateKey)

	completedTx.hexInput = stringToHex(
		JSONStringify({
			format: completedTx.format,
			amount: completedTx.amount,
			receiver: completedTx.receiver,
			sender: completedTx.sender,
		}),
	)
	logToConsole('Encoding transaction...')
	const convertedTransaction = stringToBigInt(completedTx) as TxInterfaceCore
	const base64Data = encodeTx(convertedTransaction)
	return {
		status: true,
		txHash: completedTx.txHash,
		base64Data,
		rawData: completedTx,
	}
}
