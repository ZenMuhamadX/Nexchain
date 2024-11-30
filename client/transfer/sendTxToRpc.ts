import { rpcClient } from 'client/rpc-client/rpcClient'
import { TxInterface } from 'interface/structTx'
import { logToConsole } from 'logging/logging'
import { encode } from 'msgpack-lite'

export const sendTransactionToRpc = async (
	data: TxInterface,
): Promise<boolean> => {
	const encodedData = encode(data)
	const isSucces = await rpcClient.request('nex_sendTransaction', encodedData)
	if (!isSucces) throw new Error('Transaction failed')
	logToConsole(`Transaction ${data.txHash} sent successfully waiting for mined`)
	return isSucces
}
