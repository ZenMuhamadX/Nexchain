import { rocksState } from 'nexchain/db/state'

/**
 * Fungsi untuk menyimpan pending balance ke database
 * @param {string} userId - ID unik user
 * @param {number} pendingAmount - Jumlah pending balance yang akan disimpan
 * @returns {Promise} - Resolusi ketika data telah tersimpan
 */

export interface pendingBalance {
	address: string
	pendingAmount: number
}

export const setPendingBalance = async (data: pendingBalance): Promise<any> => {
	try {
		const pendingBalanceData: pendingBalance = {
			address: data.address,
			pendingAmount: data.pendingAmount,
		}
		const stringData = JSON.stringify(pendingBalanceData)
		// Simpan pending balance ke database dengan key berdasarkan userId
		await rocksState.put(`pendingBalance:${data.address}`, stringData)
	} catch (error) {
		console.error(error)
	}
}
