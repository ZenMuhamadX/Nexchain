import { createHash } from 'crypto'
import { prepareBlockForHashing } from 'nexchain/block/prepareBlock'
import { Block } from 'nexchain/model/block/block'

const DIFFICULTY_PREFIX = '0000' // Kriteria kesulitan

export const proofOfWork = (block: Block): { nonce: number; hash: string } => {
	let nonce = 0
	let hash: string
	const stringBlock = prepareBlockForHashing(block)
	// Mencari nonce yang valid
	do {
		nonce++
		const input = `${stringBlock}${nonce}` // Gabungkan data dan nonce
		hash = createHash('sha256').update(input).digest('hex')
	} while (!hash.startsWith(DIFFICULTY_PREFIX))

	return { nonce, hash } // Kembalikan nonce dan hash yang ditemukan
}
