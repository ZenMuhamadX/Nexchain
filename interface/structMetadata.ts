import { HexString } from './structBlock'

export interface metadata {
	txCount: number
	gasPrice: number
	created_at: number
	extraData: HexString
}
