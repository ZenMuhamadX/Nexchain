import { toNexu } from 'nexchain core/nexucoin/toNexu'

export const cutBlockReward = (currentHeight: number): bigint => {
	const initialReward = toNexu('50') // Reward awal dalam Nexu
	const minReward = toNexu('0.001') // Reward minimum
	const reductionPer100Blocks = toNexu('0.015') // Pengurangan per 20 blok

	// Hitung jumlah pengurangan berdasarkan blok ke-50
	const reductions = Math.floor(currentHeight / 100)
	let reward = initialReward - BigInt(reductions) * reductionPer100Blocks

	// Batasi reward ke minimum 0.001 Nexu
	if (reward < minReward) {
		reward = minReward
	}

	return reward
}
