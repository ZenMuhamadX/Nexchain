export interface structWalletToSave {
	data: {
		wallet: string
		publicKey: string
		privateKey: string
	}
	metadata: {
		timestamp: string
		label: string
	}
	checkSum?: string
	iv?:string
	authTag?:string
}
