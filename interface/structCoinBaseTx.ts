import { HexString } from './structBlock'

export interface coinBaseTx {
	receiver: string
	amount: number
	extraData?: HexString
}
