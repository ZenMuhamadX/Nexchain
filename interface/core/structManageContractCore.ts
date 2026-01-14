interface transaction {
	amount: bigint
	format: 'NXC'
	timestamp: number
}

export interface withdrawFromContractCore extends transaction {
	receiver: string
}

export interface transferToContractCore extends transaction {
	sender: string
}
