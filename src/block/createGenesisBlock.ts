/** @format */

import { loggingErr } from '../logging/errorLog'
import { proofOfWork } from '../miner/POW'
import { Block } from '../model/blocks/block'
import { createSignature } from '../lib/block/createSignature'
import { generateTimestampz } from '../lib/timestamp/generateTimestampz'
import { calculateSize } from '../lib/utils/calculateSize'
import { saveBlock } from '../storage/saveBlock'
import { putBalance } from 'src/wallet/balance/putBalance'
import { myWalletAddress } from 'src/wallet/myWalletAddress'
import { calculateTotalFees } from 'src/transaction/totalFees'
import { getNetworkId } from 'src/network/lib/getNetId'

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
				hashingAlgorithm: 'SHA256',
			},
			blockReward: 5000000,
			totalTransactionFees: 0,
			height: 0,
			merkleRoot:
				'0000000000000000000000000000000000000000000000000000000000000000',
			networkId: getNetworkId(),
			signature: '',
			size: 0,
			status: 'confirmed',
			coinbaseTransaction: {
				amount: 5000000,
				reward: 5000000,
				to: 'NxC12YWoAES6hAj8mHuJA13CCvbSLD3jtDGys',
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
		).signature
		const validHash = proofOfWork(genesisBlock)
		genesisBlock.block.header.hash = validHash.hash
		genesisBlock.block.header.nonce = validHash.nonce
		genesisBlock.block.size = calculateSize(genesisBlock.block).KB
		saveBlock(genesisBlock)
		putBalance('NxC12YWoAES6hAj8mHuJA13CCvbSLD3jtDGys', {
			address: 'NxC12YWoAES6hAj8mHuJA13CCvbSLD3jtDGys',
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
