import { verifyStruct } from './module/verifyStruct'
import { verifyPow } from './module/verifyPow'
import { verifyHashLength } from './module/verifyHashLength'
import { verifyBlockHash } from './module/verifyBlockHash'
import { getBlockByHeight } from 'nexchain/block/query/onChain/block/getBlockByHeight'
import { Block } from 'nexchain/model/block/block'
import { verifyMerkleRoot } from './module/verifyMerkleRoot'
import { logToConsole } from 'logging/logging'
import { verifySignature } from 'sign/verifySIgnature'

// Function to verify the integrity of the blockchain
export const verifyChainIntegrity = async (): Promise<boolean> => {
	logToConsole('Checking chain integrity...')
	let currentHeight = 0
	while (true) {
		const block: Block = (await getBlockByHeight(
			currentHeight,
			'json',
		)) as Block
		if (!block) {
			logToConsole('Chain integrity verified.')
			return true
		}
		verifySignature(block.block.header.hash as string, block.block.sign)
		verifyMerkleRoot(block.block.transactions, block.block.merkleRoot)
		verifyStruct(block)
		verifyPow(block)
		verifyHashLength(block.block.header.hash)
		verifyBlockHash(block)
		currentHeight++
	}
}
