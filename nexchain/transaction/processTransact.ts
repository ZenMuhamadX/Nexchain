import { loggingErr } from 'logging/errorLog'
import { txInterface } from 'interface/Nexcoin.inf'
import { processSender } from './sender/processSender'
import { processReciever } from './reciever/processReciever'
import { removeMemPool } from 'nexchain/storage/mempool/removeMempool'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { saveTxAddress } from './saveTxAddress'
import { saveTxHistory } from './saveTxHistory'

export const processTransact = async (txData: txInterface[]): Promise<void> => {
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

	for (const tx of txData) {
		try {
			await processSender(tx.from, tx.amount, tx.fee!)
			await processReciever(tx.to, tx.amount)
			await saveTxAddress(tx.from, tx.to, tx.txHash!)
			await saveTxHistory(tx.txHash!, tx)
			await removeMemPool(tx.txHash!)
		} catch (error) {
			loggingErr({
				error: error instanceof Error ? error.message : 'Unknown error',
				stack: new Error().stack,
				hint: 'Error processing transaction',
				time: generateTimestampz(),
				warning: null,
				context: 'leveldb processTransaction',
			})
		}
	}
}
