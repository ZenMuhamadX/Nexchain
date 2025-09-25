/** @format */

import { loggingErr } from '../../logging/errorLog'
import { proofOfWork } from '../miner/Pow'
import { Block } from '../model/block/block'
import { generateTimestampz } from '../lib/generateTimestampz'
import { calculateSize } from '../lib/calculateSize'
import { calculateTotalFees } from 'nexchain core/transaction/utils/totalFees'
import { saveBlock } from 'nexchain core/savers/block/saveBlock'
import { stringToHex } from 'nexchain core/hex/stringToHex'
import { toNexu } from 'nexchain core/nexucoin/toNexu'
import { getMinerId } from 'p2p/utils/getMinerId'
import { countHashDifficulty } from './countHashDifficulty'
import { getBlockByHeight } from './query/onChain/block/getBlockByHeight'
import { loadWallet } from 'libAccount/utils/loadWallet'
import { getMyWalletAddress } from 'libAccount/myWalletAddress'
import { createSignature } from 'sign/createSign'
import { putAccountCore } from 'nexchain core/savers/account/putAccountCore'
import { generateKeysFromMnemonic } from 'key/genKeyFromMnemonic'

export const createGenesisBlock = async (): Promise<Block | undefined> => {
	const block: Block = (await getBlockByHeight(0, 'json')) as Block
	if (block) {
		console.log('Genesis block already exists.')
		return undefined
	}
	try {
		const wallet = loadWallet()!
		const { privateKey } = generateKeysFromMnemonic(wallet.phrase)
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
			blockReward: toNexu('500'),
			totalTransactionFees: 0n,
			totalReward: toNexu('500'),
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
				amount: toNexu('500'),
				receiver: getMyWalletAddress(),
				// receeiver: 'NxCeae0aadeb2604e2e7c4044677e45bb6ae059dc7a',
				extraData: stringToHex('Genesis Block Reward'),
			},
			metadata: {
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
		await putAccountCore(genesisBlock.block.coinbaseTransaction.receiver, {
			address: genesisBlock.block.coinbaseTransaction.receiver,
			balance: genesisBlock.block.coinbaseTransaction.amount,
			transactionCount: 1,
			isContract: false,
			lastTransactionDate: generateTimestampz(),
			nonce: 0,
		})
		await saveBlock(genesisBlock)
		return genesisBlock
	} catch (error) {
		loggingErr({
			message: error,
			context: 'createGenesisBlock',
			hint: 'Error creating genesis block',
			stack: new Error().stack!,
			timestamp: generateTimestampz(),
			level: 'error',
			priority: 'high',
		})
		return
	}
}
