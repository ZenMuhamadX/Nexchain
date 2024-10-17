import { ec as EC } from 'elliptic'
import { txInterface } from '../../model/interface/memPool.inf'
import { Block } from '../../model/block/block'

const ec = new EC('secp256k1')

// Fungsi untuk memverifikasi signature
export const verifySignature = (
	data: string | Block | txInterface,
	signature: string,
	publicKey: string,
): { status: boolean; message: string } => {
	const stringData = JSON.stringify(data)
	const dataBuffer = Buffer.from(stringData)
	const key = ec.keyFromPublic(publicKey, 'hex')

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
