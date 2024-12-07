import { loadWallet } from './utils/loadWallet'

/**
 * Retrieves the wallet address from the loaded wallet.
 * @returns The wallet address as a string.
 */
export const getMyWalletAddress = (): string => {
	// Load the wallet object and return the wallet address
	return loadWallet()?.address!
}
