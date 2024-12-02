import { isValidAddress } from 'nexchain/transaction/utils/isValidAddress'
import { client } from './rpcClient'
import { structBalance } from 'interface/structBalance'

export const rpcGetAccount = async (
	address: string,
): Promise<structBalance | undefined> => {
	try {
		if (isValidAddress(address)) {
			return await client.request('nex_getAccount', address)
		}
		return
	} catch (err) {
		throw err
	}
}
