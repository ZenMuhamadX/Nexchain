/** @format */

import { loggingErr } from '../../logging/errorLog'
import { proofOfWork } from '../../miner/POW'
import { Block } from '../../model/blocks/block'
import { MemPoolInterface } from '../../model/interface/memPool.inf'
import { createTxHash } from '../hash/createTxHash'
import { createSignature } from './createSignature'
import { generateTimestampz } from '../timestamp/generateTimestampz'
import { calculateSize } from '../utils/calculateSize'
import { saveBlock } from './saveBlock'

export const createGenesisBlock = (): Block => {
	try {
		const transactGenesis: MemPoolInterface = {
			amount: 5000000,
			from: 'NexChain',
			to: 'NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U',
			signature: createSignature('NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U')
				.signature,
			timestamp: generateTimestampz(),
			message: 'Reward Genesis Block',
			status: 'confirmed',
			fee: 0,
		}
		transactGenesis.txHash = createTxHash(transactGenesis)
		const genesisBlock = new Block(
			0,
			generateTimestampz(),
			[transactGenesis],
			'0000000000000000000000000000000000000000000000000000000000000000',
			'',
			'',
			[
				{
					address: 'NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U',
					balance: 5000000,
					signature: createSignature('NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U')
						.signature,
				},
			],
			'',
		)
		genesisBlock.blk.size = calculateSize(genesisBlock.blk).KB
		genesisBlock.blk.signature = createSignature(
			genesisBlock.blk.header.hash,
		).signature
		const validHash = proofOfWork(genesisBlock)
		genesisBlock.blk.header.hash = validHash.hash
		genesisBlock.blk.header.nonce = validHash.nonce
		saveBlock(genesisBlock)
		return genesisBlock
	} catch (error) {
		loggingErr({
			error: error,
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		throw new Error('Failed to create genesis block.')
	}
}
