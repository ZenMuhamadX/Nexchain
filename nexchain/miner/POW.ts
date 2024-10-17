import crypto from 'crypto'
import { Block } from '../model/blocks/block'
import { structBlockReadyToHash } from '../lib/block/convertBlock'

const DIFFICULTY_PREFIX = '0000' // Sesuaikan dengan kriteria kesulitan yang diinginkan

interface VerifiedResult {
	nonce: number
	hash: string
}

// Lakukan algoritma Proof of Work untuk menemukan nonce yang valid
export const proofOfWork = (block: Block): VerifiedResult => {
	let nonce = 0
	let totalHashes = 0
	const readyBlock = structBlockReadyToHash(block)
	const startTime = Date.now() // Waktu mulai
	console.log('Job recived')

	while (true) {
		const nonceBuffer = Buffer.from(nonce.toString())
		const combineBlock = Buffer.concat([readyBlock, nonceBuffer])

		// Hitung hash SHA-256
		const hash = crypto.createHash('sha256').update(combineBlock).digest('hex')
		totalHashes++

		// Hitung waktu yang telah berlalu
		const elapsedTime = (Date.now() - startTime) / 1000 // dalam detik

		// Hitung kecepatan hashing
		const hashesPerSecond = totalHashes / elapsedTime

		// Perbarui konsol dengan informasi saat ini
		process.stdout.write(
			`Nonce: ${nonce} | Total Hashes: ${totalHashes} | Time: ${elapsedTime.toFixed(2)} s | Speed: ${hashesPerSecond.toFixed(2)} hashes/s\r`,
		)

		// Periksa apakah hash memenuhi kriteria kesulitan
		if (hash.startsWith(DIFFICULTY_PREFIX)) {
			const endTime = Date.now() // Waktu selesai
			const duration = (endTime - startTime) / 1000 // Durasi dalam detik
			const finalHashesPerSecond = totalHashes / duration // Hitung kecepatan hashing final

			console.log(`\nNonce yang valid ditemukan: ${nonce}, Hash: ${hash}`)
			console.log(`Total Hashes: ${totalHashes}`)
			console.log(`Waktu Total: ${duration.toFixed(2)} detik`)
			console.log(
				`Kecepatan akhir: ${finalHashesPerSecond.toFixed(2)} hashes/detik`,
			)
			console.log('Job done')
			return { nonce: nonce, hash }
		}

		nonce++ // Tingkatkan nonce dan coba lagi
	}
}
