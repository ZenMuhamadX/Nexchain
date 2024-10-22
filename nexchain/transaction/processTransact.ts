import { loggingErr } from 'logging/errorLog'
import { TxInterface } from 'interface/structTx'
import { processSender } from './sender/processSender'
import { processReciever } from './reciever/processReciever'
import { removeMemPool } from 'nexchain/storage/mempool/removeMempool'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { saveTxAddress } from './saveTxAddress'
import { saveTxHistory } from './saveTxHistory'

export const processTransact = async (txData: TxInterface[]): Promise<void> => {
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
			await processSender(tx.sender, tx.amount, tx.fee!)
			await processReciever(tx.receiver, tx.amount)
			await saveTxAddress(tx.sender, tx.receiver, tx.txHash!)
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
