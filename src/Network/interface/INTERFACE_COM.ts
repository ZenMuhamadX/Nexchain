export interface COM {
	type:
		| 'NEW_TRANSACTION'
		| 'NEW_BLOCK'
		| 'REQUEST_BLOCK'
		| 'SEND_BLOCK'
		| 'SYNC_REQUEST'
		| 'SYNC_RESPONSE'
		| 'PERR_DISCOVERY'
		| 'PERR_RESPONSE'
		| 'PING'
		| 'ERROR'
		| 'GET_LASTBLOCK'
	header: {
		nodeId: number
		timestamp: number
		version: string
	}
	data: any
}
