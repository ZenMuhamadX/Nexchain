/** @format */

import { loggingErr } from '../../logging/errorLog'
import { proofOfWork } from '../../miner/POW'
import { Block } from '../../model/blocks/block'
import { createSignature } from './createSignature'
import { generateTimestampz } from '../timestamp/generateTimestampz'
import { calculateSize } from '../utils/calculateSize'
import { saveBlock } from '../../storage/saveBlock'
import { putBalance } from 'src/wallet/balance/putBalance'
import { myWalletAddress } from 'src/wallet/myWalletAddress'

export const createGenesisBlock = (): Block => {
	try {
		// transactGenesis.txHash = createTxHash(transactGenesis)
		const genesisBlock = new Block({
			header: {
				difficulty: 5,
				hash: '',
				nonce: '',
				previousBlockHash:
					'0000000000000000000000000000000000000000000000000000000000000000',
				timestamp: generateTimestampz(),
				version: '1.0.0',
			},
			gasUsed: 0,
			totalTransactionFees: 0,
			height: 0,
			merkleRoot: '',
			networkId: '',
			signature: '',
			size: 0,
			status: 'confirmed',
			coinbaseTransaction: {
				amount: 5000000,
				reward: 5000000,
				to: 'NxC157CtSagAk29KtGcvzUfF4v5XwqwGdc4jQ',
			},
			validator: {
				rewardAddress: myWalletAddress(),
				stakeAmount: 0,
				validationTime: generateTimestampz(),
			},
			metadata: {
				gasPrice: 0,
				created_at: generateTimestampz(),
				txCount: 0,
				notes: 'NexChains Genesis Block',
			},
			transactions: [],
		})
		genesisBlock.block.signature = createSignature(
			genesisBlock.block.header.hash,
		).signature
		const validHash = proofOfWork(genesisBlock)
		genesisBlock.block.header.hash = validHash.hash
		genesisBlock.block.header.nonce = validHash.nonce
		genesisBlock.block.size = calculateSize(genesisBlock.block).KB
		saveBlock(genesisBlock)
		putBalance('NxC157CtSagAk29KtGcvzUfF4v5XwqwGdc4jQ', {
			address: 'NxC157CtSagAk29KtGcvzUfF4v5XwqwGdc4jQ',
			balance: genesisBlock.block.coinbaseTransaction.reward,
			timesTransaction: 0,
		})
		return genesisBlock
	} catch (error) {
		loggingErr({
			error: error,
			context: 'createGenesisBlock',
			hint: 'Error creating genesis block',
			warning: null,
			stack: new Error().stack,
			time: generateTimestampz(),
		})
		throw new Error('Failed to create genesis block.')
	}
}
