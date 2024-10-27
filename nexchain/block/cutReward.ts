export const setBlockReward = (currentHeight: number): number => {
	let reward = 50 // Reward awal

	// Hitung jumlah potongan yang sudah dilakukan
	const reductions = Math.floor(currentHeight / 20)

	// Kurangi reward berdasarkan jumlah potongan
	reward -= reductions * 0.001

	if (reward < 0) {
		reward = 0.0000001
	}

	return reward
}
