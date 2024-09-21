import { ec as EC } from 'elliptic'
import { createHash } from 'crypto'
import { MemPoolInterface } from '../../model/interface/memPool.inf'
import { Block } from '../../model/blocks/block'
import { getKeyPair } from '../hash/getKeyPair'

const ec = new EC('secp256k1')

// Fungsi untuk memverifikasi signature
export const verifySignature = (
	datas: string | Block | MemPoolInterface,
	signature: string,
): { status: boolean; message: string } => {
	const pubKey = getKeyPair().publicKey
	const stringData = JSON.stringify(datas)
	const data = Buffer.from(stringData)
	const key = ec.keyFromPublic(pubKey, 'hex')
	if (!key) {
		return {
			status: false,
			message: 'Invalid public key',
		}
	}
	const verified = key.verify(
		createHash('sha256').update(data).digest('hex'),
		signature,
	)
	if (!verified) {
		return {
			status: false,
			message: 'Invalid signature',
		}
	}
	return {
		status: verified,
		message: 'Signature verified successfully',
	}
}
