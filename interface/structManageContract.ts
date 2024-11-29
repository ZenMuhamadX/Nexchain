interface transaction {
	amount: number
	format: 'NXC'
	timestamp: number
}

export interface withdrawFromContract extends transaction {
	receiver: string
}

export interface transferToContract extends transaction {
	sender: string
}
