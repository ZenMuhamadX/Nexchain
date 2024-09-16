/** @format */

import { loggingErr } from '../../logging/errorLog'
import { proofOfWork } from '../../miner/POW'
import { Block } from '../../model/blocks/block'
// import { generateBlockHash } from '../hash/generateHash'
import { generateSignature } from '../hash/generateSIgnature'
import { getKeyPair } from '../hash/getKeyPair'
import { generateTimestampz } from '../timestamp/generateTimestampz'
import { calculateSize } from '../utils/calculateSize'
import { saveBlock } from './saveBlock'

export const createGenesisBlock = (): Block => {
	try {
		const genesisBlock = new Block(
			0,
			generateTimestampz(),
			[],
			'0000000000000000000000000000000000000000000000000000000000000000',
			'',
			'',
			[
				{
					address: 'NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U',
					balance: 5000000,
					signature: generateSignature(
						'NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U',
						getKeyPair().privateKey,
					),
				},
			],
			'',
		)
		genesisBlock.blk.size = calculateSize(genesisBlock.blk).KB
		genesisBlock.blk.signature = generateSignature(
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
