import { encode } from '@msgpack/msgpack'
import { TxInterface } from 'interface/structTx'
import { uint8ToBase64 } from '../base64/uint8ToBase64'

export const encodeTx = (transaction: TxInterface): string => {
	const serialize = JSON.stringify(transaction)
	const uint8: Uint8Array = encode(serialize, {
		useBigInt64: true,
		maxDepth: 50,
	})
	return uint8ToBase64(uint8)
}
