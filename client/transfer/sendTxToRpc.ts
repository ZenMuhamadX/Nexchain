import { rpcClient } from 'client/rpc-client/rpcClient'

export const sendTransactionToRpc = async (data: string): Promise<boolean> => {
	const isSucces = await rpcClient.request('nex_sendTransaction', data)
	if (!isSucces) throw new Error('Transaction failed')
	return isSucces
}
