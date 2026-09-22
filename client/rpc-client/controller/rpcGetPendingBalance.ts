import { isValidAddress } from 'nexchain core/transaction/utils/isValidAddress'
import { client } from '../lib/rpcClient'
import { pendingBalance } from 'nexchain core/savers/transaction/setPendingBalance'
import { bigIntToString } from 'nexchain core/savers/lib/bigintToString'

export const rpcGetPendingBalance = async (
	address: string,
): Promise<pendingBalance | undefined> => {
	if (isValidAddress(address)) {
		const result = await client.request('nex_getPendingBalance', address)
		return bigIntToString(result) as pendingBalance
	}
	return undefined
}
