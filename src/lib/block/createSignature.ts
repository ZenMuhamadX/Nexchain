import { ec as EC } from 'elliptic'
import { createHash } from 'crypto'
import { getKeyPair } from '../hash/getKeyPair'
import { Block } from '../../model/blocks/block'
import { memPoolInterface } from '../../model/interface/memPool.inf'

const ec = new EC('secp256k1')

// Fungsi untuk membuat signature
export const createSignature = (datas: string | Block | memPoolInterface): {status:boolean, signature: string} => {
	const stringData = JSON.stringify(datas)
	const data = Buffer.from(stringData)
	const { privateKey } = getKeyPair()
	const keyPair = ec.keyFromPrivate(privateKey, 'hex')
	const signature = keyPair.sign(
		createHash('sha256').update(data).digest('hex'),
	)
	if (!signature) {
		return {
			status: false,
			signature: '',
		}
	}
	return {
		status: true,
		signature: signature.toDER('hex'),
	}
}
