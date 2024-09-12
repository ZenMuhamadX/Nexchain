import { loggingErr } from '../../logging/errorLog'
import { proofOfWork } from '../../miner/POW'
import { Block } from '../../model/blocks/Block'
// import { generateBlockHash } from '../hash/generateHash'
import { generateSignature } from '../hash/generateSIgnature'
import { getKeyPair } from '../hash/getKeyPair'
import { generateTimestampz } from '../timestamp/generateTimestampz'
import { saveBlock } from './saveBlock'

export const createGenesisBlock = (): Block => {
	try {
		const genesisBlock = new Block(0, generateTimestampz(), [], '', '', '', [
			{
				address: 'NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U',
				balance: 5000000,
				signature: generateSignature(
					'NxC1Aom5fbbxQ9AMoXwxUwSirZCAXVYqm5y3U',
					getKeyPair().privateKey,
				),
			},
		])
		genesisBlock.hash = proofOfWork({
			index: genesisBlock.index,
			timestamp: genesisBlock.timestamp,
			transactions: genesisBlock.transactions,
			previousHash: genesisBlock.previousHash,
			signature: genesisBlock.signature,
		}).hash
		genesisBlock.nonce = proofOfWork({
			index: genesisBlock.index,
			timestamp: genesisBlock.timestamp,
			transactions: genesisBlock.transactions,
			previousHash: genesisBlock.previousHash,
			signature: genesisBlock.signature,
		}).nonce
		genesisBlock.signature = generateSignature(
			genesisBlock.hash,
			getKeyPair().privateKey,
		)
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
