import { clientSideTxValidate } from 'client/lib/clientValidateTx'
import { client } from 'client/rpc-client/lib/rpcClient'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'
import { logToConsole } from 'logging/logging'
import { encodeTx } from 'nexchain core/hex/tx/encodeTx'
import { stringToBigInt } from 'nexchain core/loaders/lib/stringToBigint'

export const sendTransactionToRpc = async (
	transaction: TxInterfaceCore,
): Promise<{ sentStatus: boolean }> => {
	const convertedTx = stringToBigInt(transaction) as TxInterfaceCore
	try {
		logToConsole('Validating transaction...')
		const isValidTx = await clientSideTxValidate(convertedTx)
		if (!isValidTx) {
			logToConsole('Transaction is not valid')
			return { sentStatus: false }
		}

		logToConsole('Encoding transaction...')
		const base64Data = encodeTx(convertedTx)

		logToConsole('Sending transaction via RPC...')
		const isSuccess = await client.request('nex_sendTransaction', base64Data)
		logToConsole(`Transaction sent successfully: ${convertedTx.txHash}`)

		return { sentStatus: isSuccess }
	} catch (error) {
		console.error('Error occurred during transaction:', error)
		return { sentStatus: false }
	}
}
