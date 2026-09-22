import { getAccount } from 'account/balance/getAccount'

export const getOwnerNonce = async (address: string): Promise<number> => {
	const wallet = await getAccount(address)
	// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
	return wallet?.nonce!
}
