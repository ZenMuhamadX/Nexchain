import { isValidAddress } from 'nexchain core/transaction/utils/isValidAddress'
import { client } from '../lib/rpcClient'
import { pendingBalance } from 'nexchain core/transaction/setPendingBalance'

export const rpcGetPendingBalance = async (
	address: string,
): Promise<pendingBalance | undefined> => {
	if (isValidAddress(address)) {
		return await client.request('nex_getPendingBalance', address)
	}
	return undefined
}
