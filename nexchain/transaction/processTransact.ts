import { loggingErr } from 'logging/errorLog'
import { TxInterface } from 'interface/structTx'
import { processSender } from './sender/processSender'
import { removeMemPool } from 'nexchain/storage/mempool/removeMempool'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { saveTxAddress } from './saveTxAddress'
import { saveTxHistory } from './saveTxHistory'
import { processReceiver } from './receiver/processReceiver'
import { transferToContract } from './contract/transferToContract'

export const processTransact = async (txData: TxInterface[]): Promise<void> => {
	if (txData.length === 0) {
		loggingErr({
			message: 'data not found',
			stack: new Error().stack!,
			hint: 'data not found',
			timestamp: generateTimestampz(),
			level: 'error',
			priority: 'high',
			context: 'leveldb processTransaction',
		})
		return
	}

	for (const tx of txData) {
		if (tx.isReceiverContract) {
			try {
				await transferToContract({
					amount: tx.amount,
					contractAddress: tx.receiver,
					fee: tx.fee!,
					sender: tx.sender,
				})
				await saveTxAddress(tx.sender, tx.receiver, tx.txHash!)
				await saveTxHistory(tx.txHash!, tx)
				removeMemPool(tx.txHash!)
			} catch (error) {
				loggingErr({
					message: error instanceof Error ? error.message : 'Unknown error',
					stack: new Error().stack!,
					hint: 'Error processing transfer to contract',
					timestamp: generateTimestampz(),
					level: 'error',
					priority: 'high',
					context: 'transferToContract',
				})
			}
			// Lanjutkan ke transaksi berikutnya
			continue
		}

		try {
			await processSender(tx.sender, tx.amount, tx.fee!)
			await processReceiver(tx.receiver, tx.amount)
			await saveTxAddress(tx.sender, tx.receiver, tx.txHash!)
			await saveTxHistory(tx.txHash!, tx)
			removeMemPool(tx.txHash!)
		} catch (error) {
			loggingErr({
				message: error instanceof Error ? error.message : 'Unknown error',
				stack: new Error().stack!,
				hint: 'Error processing transaction',
				timestamp: generateTimestampz(),
				level: 'error',
				priority: 'high',
				context: 'leveldb processTransaction',
			})
		}
	}
}
