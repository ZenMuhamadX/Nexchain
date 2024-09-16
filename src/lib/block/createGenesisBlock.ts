/** @format */

import { loggingErr } from '../../logging/errorLog'
import { proofOfWork } from '../../miner/POW'
import { Block } from '../../model/blocks/block'
import { memPoolInterface } from '../../model/interface/memPool.inf'
import { createTxHash } from '../hash/createTxHash'
import { sign } from '../hash/sign'
import { getKeyPair } from '../hash/getKeyPair'
import { generateTimestampz } from '../timestamp/generateTimestampz'
import { calculateSize } from '../utils/calculateSize'
import { saveBlock } from './saveBlock'

export const createGenesisBlock = (): Block => {
	try {
		const transactGenesis: memPoolInterface = {
			amount: 5000000,
			from: 'NexChain',
			to: 'NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U',
			signature: sign(
				'NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U',
				getKeyPair().privateKey,
			),
			timestamp: generateTimestampz(),
			message: 'Reward Genesis Block',
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
					signature: sign(
						'NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U',
						getKeyPair().privateKey,
					),
				},
			],
			'',
		)
		genesisBlock.blk.size = calculateSize(genesisBlock.blk).KB
		genesisBlock.blk.signature = sign(
			genesisBlock.blk.header.hash,
			getKeyPair().privateKey,
		)
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
