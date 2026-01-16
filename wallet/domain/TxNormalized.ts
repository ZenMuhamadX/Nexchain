export interface TxNormalized {
	from: Uint8Array
	to: Uint8Array
	amount: bigint
	fee: bigint
	nonce: bigint
}
