import { ec as EC } from 'elliptic'
import { generateAddressFromPublicKey } from 'nexchain/keyPair/genAddrFromPubKey'
import { hashMessage } from './hashMessage'

const ec = new EC('secp256k1')

export interface sign {
	v: number
	r: string
	s: string
}

// Fungsi untuk memulihkan public key dari data, v, r, dan s
export const recoverPublicKey = (
	data: string,
	sign: sign,
): { publicKey: string; address: string } => {
	const dataHash = hashMessage(data)

	const recoveryParam = sign.v - 26

	// Memulihkan public key
	const signature = { r: sign.r, s: sign.s }
	const publicKey = ec
		.recoverPubKey(dataHash, signature, recoveryParam)
		.encode('hex', true)

	// Konversi public key menjadi address
	const address = generateAddressFromPublicKey(publicKey)

	return { address, publicKey }
}
