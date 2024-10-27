export const calculateTotalBlockReward = (
	reward: number,
	gasPrice: number,
	totalTxFees: number,
) => {
	return reward + gasPrice + totalTxFees
}
