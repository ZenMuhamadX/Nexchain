import { isContract } from 'nexchain/lib/isContract'
import { client } from './rpcClient'

export const rpcGetContractBalance = async (
	address: string,
): Promise<number | undefined> => {
	if (isContract(address)) {
		return await client.request('nex_getContractBalance', address)
	}
	return undefined
}
