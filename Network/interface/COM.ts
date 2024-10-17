export interface COM {
	type:
		| 'CREATE_TRANSACTION'
		| 'REQ_BLOCK'
		| 'PEERS_ID'
		| 'GREETING'
		| 'MINE'
		| 'UPDATE_BLOCK'
	payload: { data: any }
	isClient: boolean
	forwardCount: number
	messageId: string
	timestamp: number
}
