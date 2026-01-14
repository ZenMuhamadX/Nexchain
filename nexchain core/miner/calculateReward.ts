export const calculateTotalBlockReward = (
	reward: bigint,
	totalTxFees: bigint,
): bigint => {
	return reward + totalTxFees
}
