import { ec as EC } from 'elliptic'
import { MemPoolInterface } from '../../model/interface/memPool.inf'
import { Block } from '../../model/blocks/block'
import { getKeyPair } from '../hash/getKeyPair'

const ec = new EC('secp256k1')

// Fungsi untuk memverifikasi signature
export const verifySignature = (
	data: string | Block | MemPoolInterface,
	signature: string,
): { status: boolean; message: string } => {
	const pubKey = getKeyPair().publicKey
	const stringData = JSON.stringify(data)
	const dataBuffer = Buffer.from(stringData)
	const key = ec.keyFromPublic(pubKey, 'hex')

	// Check if the key is valid
	if (!key) {
		return {
			status: false,
			message: 'Invalid public key',
		}
	}

	// Verify the signature
	const verified = key.verify(dataBuffer, signature)
	if (!verified) {
		return {
			status: false,
			message: 'Invalid signature',
		}
	}

	return {
		status: true,
		message: 'Signature verified successfully',
	}
}
