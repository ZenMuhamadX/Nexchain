import { decode } from '@msgpack/msgpack'
import { TxInterface } from 'interface/structTx'
import { base64ToUint8 } from '../base64/base64ToUint8'

export const decodeTx = (data: string): TxInterface => {
	const uint8 = base64ToUint8(data)
	const decodedData = decode(uint8) as string
	return JSON.parse(decodedData)
}
