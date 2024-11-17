import { toNexu } from 'nexchain/nexucoin/toNexu'

export const cutBlockReward = (currentHeight: number): number => {
	const initialReward = toNexu(50) // Reward awal dalam Nexu
	const minReward = toNexu(0.001) // Reward minimum
	const reductionPer20Blocks = toNexu(0.00099998) // Pengurangan per 20 blok

	// Hitung jumlah pengurangan berdasarkan blok ke-20
	const reductions = Math.floor(currentHeight / 20)
	let reward = initialReward - reductions * reductionPer20Blocks

	// Batasi reward ke minimum 0.001 Nexu
	if (reward < minReward) {
		reward = minReward
	}

	return reward
}
