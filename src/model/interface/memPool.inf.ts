export interface memPoolInterface {
	to: string
	from: string
	amount: number
	txHash?: string
	timestamp:number | string
	signature:string
	message?: string
}
