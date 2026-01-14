import { rocksState } from 'nexchain core/db/state'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'

/**
 * Fungsi untuk menyimpan pending balance ke database
 * @param {string} userId - ID unik user
 * @param {number} pendingAmount - Jumlah pending balance yang akan disimpan
 * @returns {Promise} - Resolusi ketika data telah tersimpan
 */

export interface pendingBalance {
	address: string
	pendingAmount: bigint
}

export const setPendingBalance = async (data: pendingBalance): Promise<any> => {
	try {
		const pendingBalanceData: pendingBalance = {
			address: data.address,
			pendingAmount: data.pendingAmount,
		}
		const convertedPendingBalanceData = bigIntToString(pendingBalanceData)
		const stringData = JSONStringify(convertedPendingBalanceData)
		// Simpan pending balance ke database dengan key berdasarkan userId
		await rocksState.put(`pendingBalance:${data.address}`, stringData)
	} catch (error) {
		console.error(error)
	}
}
