import { getAccount } from "account/balance/getAccount"

export const getOwnerNonce = async (address: string): Promise<number> => {
	const wallet = await getAccount(address)
	return wallet?.nonce!
}
