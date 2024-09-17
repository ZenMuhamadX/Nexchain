/**
 * Represents the data associated with a wallet.
 */
export interface walletData {
	address: string // The address of the wallet
	balance: number // The balance of the wallet in cryptocurrency
	signature: string // The digital signature for validating transactions or ownership
}
