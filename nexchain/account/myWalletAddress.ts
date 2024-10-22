import { loadWallet } from './utils/loadWallet'

export const myWalletAddress = (): string => {
	return loadWallet()?.walletAddress!
}
