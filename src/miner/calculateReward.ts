export const calculateTotalBlockReward = (
	reward: number,
	gasPrice: number,
	totalTxFees: number,
) => {
	return reward + gasPrice + totalTxFees * 0.000002
}
