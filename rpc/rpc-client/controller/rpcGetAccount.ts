import { isValidAddress } from 'nexchain core/transaction/utils/isValidAddress'
import { client } from '../lib/rpcClient'
import { structBalance } from 'interface/front/structBalance'

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
