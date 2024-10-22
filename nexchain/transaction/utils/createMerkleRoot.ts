import _ from 'lodash'
import { sha256 } from 'nexchain/lib/hash/hash'
import { TxInterface } from 'interface/structTx'

// Fungsi untuk menghitung Merkle Root
export const calculateMerkleRoot = (transactions: TxInterface[]): string => {
	if (transactions.length === 0) {
		return '' // Jika tidak ada transaksi, kembalikan string kosong
	}

	// Hash semua transaksi untuk mendapatkan hash awal
	let hashedTransactions = _.map(transactions, (tx) =>
		sha256(JSON.stringify(tx)),
	)

	// Proses untuk menggabungkan hash sampai tersisa satu hash (Merkle Root)
	while (hashedTransactions.length > 1) {
		let tempHashArray: string[] = []

		// Iterasi dua per dua, dan gabungkan hash mereka
		for (let i = 0; i < hashedTransactions.length; i += 2) {
			if (i + 1 < hashedTransactions.length) {
				// Jika pasangan ada, gabungkan dan hash
				tempHashArray.push(
					sha256(hashedTransactions[i] + hashedTransactions[i + 1]),
				)
			} else {
				// Jika jumlah ganjil, hash ulang hash terakhir sendiri
				tempHashArray.push(
					sha256(hashedTransactions[i] + hashedTransactions[i]),
				)
			}
		}

		// Update hashedTransactions dengan tempHashArray yang baru
		hashedTransactions = tempHashArray
	}

	// Hash terakhir yang tersisa adalah Merkle Root
	return hashedTransactions[0]
}
