import { rocksState } from 'nexchain core/db/state'
import { decodeFromBytes } from 'nexchain core/hex/bytes/decodeBytes'
import {
	pendingBalance,
	setPendingBalance,
} from '../savers/transaction/setPendingBalance'
import { JSONParse } from 'nexchain core/lib/JSONParse'

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
			await setPendingBalance({ address, pendingAmount: 0n }) // Inisialisasi dengan 0
			return { pendingAmount: 0n, address } // Kembalikan objek dengan amount 0
		}

		// Jika pending balance ada, decode dan parse
		const parsedBytes = decodeFromBytes(pendingBalanceData)
		return JSONParse(parsedBytes) as pendingBalance
	} catch (error) {
		console.error(error)
		throw error
	}
}
