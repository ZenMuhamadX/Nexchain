import { ec as EC } from 'elliptic'
import { recoverPublicKey, sign } from './recoveryPubKey'
import { hashMessage } from './hashMessage'

const ec = new EC('secp256k1')

// Fungsi untuk verifikasi signature
export const verifySignature = (data: string, sign: sign): boolean => {
	const dataHash = hashMessage(data)

	const signature = { r: sign.r, s: sign.s, v: sign.v }

	const { publicKey } = recoverPublicKey(data, signature)

	// 2. Inisialisasi public key dari key yang dipulihkan
	const keyPair = ec.keyFromPublic(publicKey, 'hex') // Public key yang dipulihkan (uncompressed)

	// 3. Verifikasi signature
	const isValid = keyPair.verify(dataHash, signature)

	// 4. Return status verifikasi
	return isValid
}
