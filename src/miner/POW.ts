import crypto from 'crypto'
import { Block } from '../model/blocks/block'
import { blockReadyToHash } from '../lib/block/blkReadyToHash'

const DIFFICULTY_PREFIX = '00000' // Ubah sesuai dengan kriteria kesulitan yang diinginkan

interface VerifiedResult {
	nonce: string
	hash: string
}

export const proofOfWork = (block: Block): VerifiedResult => {
	let nonce: number = 0
	const readyBlock = blockReadyToHash(block)
	while (true) {
		const nonceBuffer = Buffer.from(nonce.toString())
		const combineBlock = Buffer.concat([readyBlock, nonceBuffer])
		// Hitung hash SHA-256
		const hash = crypto
			.createHash('sha256')
			.update(combineBlock)
			.digest('hex')

		// Periksa apakah hash memenuhi kriteria kesulitan yang diinginkan
		const validateHash = (hash: string) => {
			// Memeriksa awalan yang sesuai dengan kriteria kesulitan
			return hash.startsWith(DIFFICULTY_PREFIX)
		}

		if (validateHash(hash)) {
			return { nonce: nonce.toString(), hash }
		}

		nonce++ // Tambah nonce dan coba lagi
	}
}
