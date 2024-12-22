import { clientSideTxValidate } from 'client/lib/clientValidateTx'
import { client } from 'client/rpc-client/lib/rpcClient'
import { TxInterface } from 'interface/structTx'
import { logToConsole } from 'logging/logging'
import { encodeTx } from 'nexchain/hex/tx/encodeTx'

export const sendTransactionToRpc = async (
	transaction: TxInterface,
): Promise<{ sentStatus: boolean }> => {
	try {
		logToConsole('Validating transaction...')
		const isValidTx = await clientSideTxValidate(transaction)
		if (!isValidTx) {
			logToConsole('Transaction is not valid')
			return { sentStatus: false }
		}

		logToConsole('Encoding transaction...')
		const base64Data = encodeTx(transaction)

		logToConsole('Sending transaction via RPC...')
		const isSuccess = await client.request('nex_sendTransaction', base64Data)
		logToConsole(`Transaction sent successfully: ${transaction.txHash}`)

		return { sentStatus: isSuccess }
	} catch (error) {
		console.error('Error occurred during transaction:', error)
		return { sentStatus: false }
	}
}
