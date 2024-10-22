/** @format */

import { loggingErr } from '../../logging/errorLog'
import { proofOfWork } from '../miner/Pow'
import { Block } from '../model/block/block'
import { createSignature } from '../lib/block/createSignature'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'
import { calculateSize } from '../lib/utils/calculateSize'
import { putBalance } from 'nexchain/account/balance/putBalance'
import { calculateTotalFees } from 'nexchain/transaction/utils/totalFees'
import { saveBlock } from 'nexchain/storage/block/saveBlock'
import { getNetworkId } from 'Network/utils/getNetId'
import { getBlockByHeight } from './query/direct/block/getBlockByHeight'
import { countHashDifficulty } from 'nexchain/lib/hash/countHashDifficulty'
import { loadWallet } from 'nexchain/account/utils/loadWallet'

export const createGenesisBlock = async (): Promise<Block | undefined> => {
	const block = await getBlockByHeight(0)
	if (block) {
		console.log('Genesis block already exists.')
		return undefined
	}
	try {
		const { privateKey } = loadWallet()!
		const genesisBlock = new Block({
			header: {
				difficulty: 0,
				hash: '',
				nonce: 0,
				previousBlockHash:
					'0000000000000000000000000000000000000000000000000000000000000000',
				timestamp: generateTimestampz(),
				version: '1.0.0',
				hashingAlgorithm: 'SHA256',
			},
			blockReward: 500,
			totalTransactionFees: 0,
			height: 0,
			merkleRoot:
				'0000000000000000000000000000000000000000000000000000000000000000',
			networkId: getNetworkId(),
			signature: '',
			size: 0,
			status: 'confirmed',
			coinbaseTransaction: {
				amount: 500,
				to: 'NxCbe89049c9b139f69e6828d2bec981a16322b3e39',
			},
			validator: {
				rewardAddress: 'NxCbe89049c9b139f69e6828d2bec981a16322b3e39',
				stakeAmount: 0,
				validationTime: generateTimestampz(),
			},
			metadata: {
				gasPrice: 0,
				created_at: generateTimestampz(),
				txCount: 0,
				notes:
					'Hassan Nasrallah Killed by Israel,Hezbollah Promises to Continue the War 29/9/2024',
			},
			transactions: [],
		})
		genesisBlock.block.totalTransactionFees = calculateTotalFees(
			genesisBlock.block.transactions,
		)
		genesisBlock.block.signature = createSignature(
			genesisBlock.block.header.hash,
			privateKey,
		).signature
		const validHash = proofOfWork(genesisBlock)
		genesisBlock.block.header.difficulty = countHashDifficulty(validHash.hash)
		genesisBlock.block.header.hash = validHash.hash
		genesisBlock.block.header.nonce = validHash.nonce
		genesisBlock.block.size = calculateSize(genesisBlock.block).KB
		putBalance(genesisBlock.block.coinbaseTransaction.to, {
			address: genesisBlock.block.coinbaseTransaction.to,
			balance: genesisBlock.block.coinbaseTransaction.amount,
			timesTransaction: 1,
			isContract: false,
			lastTransactionDate: generateTimestampz(),
			nonce: 0,
		})
		saveBlock(genesisBlock)
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
