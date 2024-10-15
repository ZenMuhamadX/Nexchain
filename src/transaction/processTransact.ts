import { loggingErr } from 'src/logging/errorLog'
import { txInterface } from 'src/model/interface/memPool.inf'
import { processSender } from './sender/processSender'
import { processReciever } from './reciever/processReciever'
import { removeMemPool } from 'src/storage/mempool/removeMempool'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { saveHistory } from './utils/saveTxHistory'
import { Block } from 'src/model/blocks/block'
import _ from 'lodash'

export const processTransact = (txData: txInterface[], block: Block): void => {
	if (txData.length === 0) {
		loggingErr({
			error: 'data not found',
			stack: new Error().stack,
			hint: 'data not found',
			time: generateTimestampz(),
			warning: null,
			context: 'leveldb processTransaction',
		})
		return
	}
	_.map(txData, (tx) => {
		const senderAddress = tx.from
		const recieverAddress = tx.to
		const amount = tx.amount
		const fee = tx.fee!
		processSender(senderAddress, amount, fee)
		processReciever(recieverAddress, amount)
		removeMemPool(tx.txHash!)
		saveHistory(tx.txHash!, {
			...tx,
			metadata: {
				blockHash: block.block.header.hash,
				blockHeight: block.block.height,
				blockTimestamp: block.block.header.timestamp,
				merkleRoot: block.block.merkleRoot,
			},
		})
	})
}
