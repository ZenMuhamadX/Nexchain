import { HexString } from 'interface/common/hexString'

export interface structCoinBaseTxCore {
	receiver: string
	amount: bigint
	extraData?: HexString
}
