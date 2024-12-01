import { TxInterface } from 'interface/structTx'
import { sha256 } from 'nexchain/block/sha256'
import { txToString } from 'nexchain/hex/tx/txToString'

// Fungsi untuk menghitung Merkle Root dari transaksi
export const createMerkleRoot = (transactions: TxInterface[]): string => {
	if (transactions.length === 0) {
		return sha256('', 'hex') as string
	}

	if (transactions.length === 1) {
		return sha256(txToString(transactions[0]), 'hex') as string
	}

	let transactionHashes: string[] = transactions.map(
		(tx) => sha256(txToString(tx), 'hex') as string,
	)

	while (transactionHashes.length > 1) {
		const tempHashes: string[] = []

		if (transactionHashes.length % 2 !== 0) {
			transactionHashes.push(transactionHashes[transactionHashes.length - 1])
		}

		for (let i = 0; i < transactionHashes.length; i += 2) {
			const combinedHash: string = sha256(
				transactionHashes[i] + transactionHashes[i + 1],
				'hex',
			) as string
			tempHashes.push(combinedHash)
		}

		transactionHashes = tempHashes
	}

	return transactionHashes[0]
}
