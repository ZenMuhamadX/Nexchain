import { decode } from '@msgpack/msgpack'
import { base64ToUint8 } from '../base64/base64ToUint8'
import { JSONParse } from 'nexchain core/lib/JSONParse'
import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'

export const decodeTx = (data: string): TxInterfaceCore => {
	const uint8 = base64ToUint8(data)
	const decodedData = decode(uint8) as string
	return JSONParse(decodedData)
}
