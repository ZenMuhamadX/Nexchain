import { ec as EC } from 'elliptic'
import { Block } from '../../model/blocks/block'
import { txInterface } from '../../model/interface/memPool.inf'

const ec = new EC('secp256k1')

// Fungsi untuk membuat signature
export const createSignature = (
	data: string | Block | txInterface,
	privateKey: string,
): { status: boolean; signature: string } => {
	// Mengubah data menjadi string JSON dan buffer
	const stringData = JSON.stringify(data)
	const dataBuffer = Buffer.from(stringData)

	// Mendapatkan pasangan kunci
	const keyPair = ec.keyFromPrivate(privateKey, 'hex')

	// Membuat signature
	const signature = keyPair.sign(dataBuffer)

	// Mengembalikan status dan signature
	return {
		status: !!signature,
		signature: signature ? signature.toDER('hex') : '',
	}
}
