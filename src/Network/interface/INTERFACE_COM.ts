export interface COM {
	type: string
	header: {
		nodeId: number
		timestamp: number
		version: string
	}
	data: any
}
