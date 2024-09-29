import { loggingErr } from 'src/logging/errorLog'
import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { processSender } from './processSender'
import { processReciever } from './processReciever'
import { removeMemPool } from 'src/storage/removeMempool'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'

export const processTransact = (data: MemPoolInterface[]): void => {
	if (data.length === 0) {
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
	data.map((tx) => {
		const senderAddress = tx.from
		const recieverAddress = tx.to
		const amount = tx.amount
		const fee = tx.fee!
		processSender(senderAddress, amount, fee)
		processReciever(recieverAddress, amount)
		removeMemPool(tx.txHash!)
	})
}
