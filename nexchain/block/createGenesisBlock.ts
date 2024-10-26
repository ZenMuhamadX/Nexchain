/** @format */

import { loggingErr } from '../../logging/errorLog'
import { proofOfWork } from '../miner/Pow'
import { Block } from '../model/block/block'
import { createSignature } from '../sign/createSignature'
import { generateTimestampz } from '../lib/generateTimestampz'
import { calculateSize } from '../lib/calculateSize'
import { putBalance } from 'nexchain/account/balance/putBalance'
import { calculateTotalFees } from 'nexchain/transaction/utils/totalFees'
import { saveBlock } from 'nexchain/storage/block/saveBlock'
import { getBlockByHeight } from './query/direct/block/getBlockByHeight'
import { countHashDifficulty } from 'nexchain/block/countHashDifficulty'
import { loadWallet } from 'nexchain/account/utils/loadWallet'
import { stringToHex } from 'nexchain/hex/stringToHex'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { getMinerId } from 'Network(Development)/utils/getMinerId'

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
			totalReward: 500,
			height: 0,
			merkleRoot:
				'0000000000000000000000000000000000000000000000000000000000000000',
			minerId: getMinerId(),
			size: 0,
			sign: {
				r: '',
				s: '',
				v: 0,
			},
			status: 'confirmed',
			coinbaseTransaction: {
				amount: 500,
				receiver: 'NxCfd6d6abbe808536f1aea206388fbfd0449f1ae55',
				extraData: stringToHex('Genesis Block Reward'),
			},
			metadata: {
				gasPrice: 0,
				created_at: generateTimestampz(),
				txCount: 0,
				extraData: stringToHex(
					'Hassan Nasrallah Killed by Israel,Hezbollah Promises to Continue the War 29/9/2024',
				),
			},
			transactions: [],
		})
		genesisBlock.block.totalTransactionFees = calculateTotalFees(
			genesisBlock.block.transactions,
		)

		const validHash = proofOfWork(genesisBlock)
		genesisBlock.block.header.difficulty = countHashDifficulty(validHash.hash)
		genesisBlock.block.header.hash = validHash.hash
		genesisBlock.block.header.nonce = validHash.nonce

		genesisBlock.block.sign = createSignature(
			genesisBlock.block.header.hash,
			privateKey,
		)

		genesisBlock.block.size = calculateSize(genesisBlock.block).KB
		putBalance(genesisBlock.block.coinbaseTransaction.receiver, {
			address: genesisBlock.block.coinbaseTransaction.receiver,
			balance: toNexu(genesisBlock.block.coinbaseTransaction.amount),
			timesTransaction: 1,
			isContract: false,
			lastTransactionDate: generateTimestampz(),
			nonce: 0,
			decimal: 18,
			notes: '1^18 nexu = 1 NXC',
			symbol: 'nexu',
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
