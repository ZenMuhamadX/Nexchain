import { Block } from '../../../model/blocks/block'

export const verifyPow = (block: Block): boolean => {
	const difficulty = 4
	const target = '0'.repeat(difficulty)
	const hash = block.blk.header.hash
	if (hash === undefined) return false
	return hash.startsWith(target)
}
