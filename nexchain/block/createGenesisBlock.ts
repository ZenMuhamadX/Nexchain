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
import { loadWallet } from 'nexchain/account/utils/loadWallet'
import { stringToHex } from 'nexchain/hex/stringToHex'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { getMinerId } from 'Network(Development)/utils/getMinerId'
import { countHashDifficulty } from './countHashDifficulty'
import { getBlockByHeight } from './query/onChain/block/getBlockByHeight'
import { getMyWalletAddress } from 'nexchain/account/myWalletAddress'

export const createGenesisBlock = async (): Promise<Block | undefined> => {
	const block = await getBlockByHeight(0, 'json')
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
			blockReward: toNexu(500),
			totalTransactionFees: 0,
			totalReward: toNexu(500),
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
				amount: toNexu(500),
				receiver: getMyWalletAddress(),
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
		await putBalance(genesisBlock.block.coinbaseTransaction.receiver, {
			address: genesisBlock.block.coinbaseTransaction.receiver,
			balance: genesisBlock.block.coinbaseTransaction.amount as number,
			timesTransaction: 1,
			isContract: false,
			lastTransactionDate: generateTimestampz(),
			nonce: 0,
			decimal: 18,
			notes: '1^18 nexu = 1 NXC',
			symbol: 'nexu',
		})
		await saveBlock(genesisBlock)
		return genesisBlock
	} catch (error) {
		loggingErr({
			message: 'Error creating genesis block.',
			context: 'createGenesisBlock',
			hint: 'Error creating genesis block',
			stack: new Error().stack!,
			timestamp: generateTimestampz(),
			level: 'error',
			priority: 'high',
		})
		throw new Error('Failed to create genesis block.')
	}
}
