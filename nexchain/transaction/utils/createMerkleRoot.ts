import { TxInterface } from 'interface/structTx'
import { sha256 } from 'nexchain/lib/hash/hash'
import { txToString } from 'nexchain/lib/hex/txToString'

// Fungsi untuk menghitung Merkle Root dari transaksi
export const createMerkleRoot = (transactions: TxInterface[]): string => {
	if (transactions.length === 0) {
		return sha256('')
	}

	if (transactions.length === 1) {
		return sha256(txToString(transactions[0]))
	}

	let transactionHashes: string[] = transactions.map((tx) =>
		sha256(txToString(tx)),
	)

	while (transactionHashes.length > 1) {
		const tempHashes: string[] = []

		if (transactionHashes.length % 2 !== 0) {
			transactionHashes.push(transactionHashes[transactionHashes.length - 1])
		}

		for (let i = 0; i < transactionHashes.length; i += 2) {
			const combinedHash = sha256(
				transactionHashes[i] + transactionHashes[i + 1],
			)
			tempHashes.push(combinedHash)
		}

		transactionHashes = tempHashes
	}

	return transactionHashes[0]
}
