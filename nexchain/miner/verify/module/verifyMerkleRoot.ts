import { Block } from 'nexchain/model/block/block'
import { calculateMerkleRoot } from 'nexchain/transaction/utils/createMerkleRoot'

export const verifyMerkleRoot = (block: Block): boolean => {
	const createdMerkleRoot = calculateMerkleRoot(block.block.transactions)
	const blockMerkleRoot = block.block.merkleRoot
	if (createdMerkleRoot === blockMerkleRoot) {
		return true
	}
	return false
}
