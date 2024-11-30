import { contract } from 'interface/structContract'
import { TxInterface } from 'interface/structTx'
import { Block } from 'nexchain/model/block/block'
import { getCurrentBlock } from './query/onChain/block/getCurrentBlock'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { createMerkleRoot } from 'nexchain/transaction/utils/createMerkleRoot'
import { getMinerId } from 'p2p/utils/getMinerId'
import { stringToHex } from 'nexchain/hex/stringToHex'
import { calculateTotalFees } from 'nexchain/transaction/utils/totalFees'
import { calculateTotalBlockReward } from 'nexchain/miner/calculateReward'
import { proofOfWork } from 'nexchain/miner/Pow'
import { calculateSize } from 'nexchain/lib/calculateSize'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { cutBlockReward } from './cutReward'
import { loadWallet } from 'account/utils/loadWallet'
import { createSignature } from 'sign/createSignature'

export const createNewBlock = async (
	transactions: TxInterface[],
	walletMiner: string,
	validContract: contract[],
): Promise<Block> => {
	const latestBlock: Block = (await getCurrentBlock('json')) as Block
	const currentHeight = latestBlock.block.height
	const { privateKey } = loadWallet()!

	if (!latestBlock) {
		throw new Error('Latest block is undefined.')
	}

	// Create a new block with specified parameters.
	const newBlock = new Block({
		header: {
			difficulty: 5,
			hash: '',
			nonce: 0,
			previousBlockHash: '',
			timestamp: generateTimestampz(),
			version: '1.0.0',
			hashingAlgorithm: 'SHA256',
		},
		totalTransactionFees: 0,
		height: currentHeight + 1,
		merkleRoot: createMerkleRoot(transactions),
		minerId: getMinerId(),
		size: 0,
		sign: {
			r: '',
			s: '',
			v: 0,
		},
		status: 'confirmed',
		blockReward: 0,
		totalReward: 0,
		coinbaseTransaction: {
			amount: 0,
			receiver: walletMiner,
			extraData: stringToHex('Block reward'),
		},
		metadata: {
			extraData: stringToHex('BlockChains by NexChain'),
			gasPrice: toNexu(0.00025),
			txCount: transactions.length,
			created_at: generateTimestampz(),
		},
		transactions: transactions,
		contract: validContract,
		chainId: 26,
	})

	newBlock.block.blockReward = cutBlockReward(newBlock.block.height)

	// Calculate fees and rewards for the new block.
	newBlock.block.totalTransactionFees = calculateTotalFees(
		newBlock.block.transactions,
	)

	newBlock.block.totalReward = calculateTotalBlockReward(
		newBlock.block.blockReward,
		newBlock.block.metadata?.gasPrice!,
		newBlock.block.totalTransactionFees,
	)

	newBlock.block.coinbaseTransaction.amount = newBlock.block.totalReward

	newBlock.block.header.previousBlockHash = latestBlock.block.header.hash

	// Perform proof of work and finalize the new block.
	const { hash, nonce } = proofOfWork(newBlock)
	newBlock.block.header.nonce = nonce
	newBlock.block.header.hash = hash
	newBlock.block.size = calculateSize(newBlock).KB

	newBlock.block.sign = createSignature(newBlock.block.header.hash, privateKey)

	return newBlock
}
