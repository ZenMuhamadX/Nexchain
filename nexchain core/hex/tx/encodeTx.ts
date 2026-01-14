import { encode } from '@msgpack/msgpack'
import { uint8ToBase64 } from '../base64/uint8ToBase64'
import { JSONStringify } from 'nexchain core/lib/JSONStringify'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'

export const encodeTx = (transaction: TxInterfaceCore): string => {
	const serialize = JSONStringify(transaction)
	const uint8: Uint8Array = encode(serialize, {
		useBigInt64: true,
		maxDepth: 50,
	})
	return uint8ToBase64(uint8)
}
