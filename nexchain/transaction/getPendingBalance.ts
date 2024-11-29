import { rocksState } from 'nexchain/db/state'
import { decodeFromBytes } from 'nexchain/hex/decodeBytes'
import { pendingBalance, setPendingBalance } from './setPendingBalance'

/**
 * Fungsi untuk memuat pending balance dari database
 * @param {string} address - ID unik user
 * @returns {Promise<PendingBalance>} - Pending balance yang disimpan atau objek dengan amount 0 jika tidak ditemukan
 */
export const getPendingBalance = async (
	address: string,
): Promise<pendingBalance> => {
	try {
		// Ambil pending balance dari database berdasarkan userId
		const pendingBalanceData = await rocksState
			.get(`pendingBalance:${address}`)
			.catch(() => null)

		if (!pendingBalanceData) {
			// Jika tidak ada pending balance, set dengan nilai kosong (0)
			await setPendingBalance({ address, pendingAmount: 0 }) // Inisialisasi dengan 0
			return { pendingAmount: 0, address } // Kembalikan objek dengan amount 0
		}

		// Jika pending balance ada, decode dan parse
		const parsedBytes = decodeFromBytes(pendingBalanceData as Buffer)
		return JSON.parse(parsedBytes) as pendingBalance
	} catch (error) {
		console.error(error)
		throw error
	}
}
