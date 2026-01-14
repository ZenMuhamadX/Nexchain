interface transaction {
	amount: string
	format: 'NXC'
	timestamp: number
}

export interface withdrawFromContract extends transaction {
	receiver: string
}

export interface transferToContract extends transaction {
	sender: string
}
