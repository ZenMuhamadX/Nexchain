export interface COM {
	type:
		| 'CREATE_TRANSACTION'
		| 'REQ_BLOCK'
		| 'PEERS_ID'
		| 'GREETING'
		| 'MINE'
		| 'UPDATE_BLOCK'
	payload: { data: any }
}
