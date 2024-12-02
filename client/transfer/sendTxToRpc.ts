import chalk from 'chalk'
import { rpcClient } from 'client/rpc-client/rpcClient'
import { TxInterface } from 'interface/structTx'
import { transactionValidator } from 'interface/validation/txValidator.v'
import { logToConsole } from 'logging/logging'
import { encodeTx } from 'nexchain/hex/tx/encodeTx'

export const sendTransactionToRpc = async (
	transaction: TxInterface,
): Promise<{ sentStatus: boolean }> => {
	try {
		const isValidTx = await transactionValidator(transaction)
		if (!isValidTx) {
			return {
				sentStatus: isValidTx,
			}
		}
		const base64Data = encodeTx(transaction)
		const isSucces = await rpcClient.request('nex_sendTransaction', base64Data)
		if (isSucces) {
			logToConsole('Transaction sent successfully')
			logToConsole(`Your TxnHash: ${transaction.txHash}`)
			return { sentStatus: true }
		} else {
			logToConsole('Transaction failed to send')
		}
		return { sentStatus: false }
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error sending transaction: ${chalk.white(error.message)}`)
			return { sentStatus: false }
		} else {
			console.error('Unknown error sending transaction:', error)
			return { sentStatus: false }
		}
	}
}
