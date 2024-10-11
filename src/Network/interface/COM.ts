export interface COM {
	type:
		| 'CREATE_TRANSACTION'
		| 'REQ_BLOCK'
		| 'PEERS_ID'
		| 'GREETING'
		| 'MINE'
	payload: any
	nodeSender?: string
	timestamp?: number
}
