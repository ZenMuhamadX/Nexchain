import { getBalance } from 'nexchain/account/balance/getBalance'

export const getOwnerNonce = async (address: string): Promise<number> => {
	const wallet = await getBalance(address)
	return wallet?.nonce!
}
