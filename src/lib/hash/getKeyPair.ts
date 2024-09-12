import * as fs from 'fs'
import * as path from 'path'
import { ec as EC } from 'elliptic'

// Buat instance dari kurva ECC
const ec = new EC('secp256k1') // Anda dapat memilih kurva lain jika diinginkan

// Fungsi untuk menghasilkan pasangan kunci ECC atau membacanya dari file
export const getKeyPair = () => {
	// Tentukan path file kunci
	const publicKeyPath = path.join(__dirname, '../../../key/public.pem')
	const privateKeyPath = path.join(__dirname, '../../../key/private.pem')

	// Cek apakah file kunci sudah ada
	if (fs.existsSync(publicKeyPath) && fs.existsSync(privateKeyPath)) {
		// Membaca kunci dari file
		const publicKey = fs.readFileSync(publicKeyPath, 'utf8')
		const privateKey = fs.readFileSync(privateKeyPath, 'utf8')
		return { publicKey, privateKey }
	} else {
		// Menghasilkan pasangan kunci ECC baru
		const keyPair = ec.genKeyPair()
		const publicKey = keyPair.getPrivate('hex')
		const privateKey = keyPair.getPrivate('hex')

		// Pastikan direktori target ada
		const keyDir = path.dirname(publicKeyPath)
		if (!fs.existsSync(keyDir)) {
			fs.mkdirSync(keyDir, { recursive: true })
		}

		// Menyimpan kunci ke file
		fs.writeFileSync(publicKeyPath, publicKey)
		fs.writeFileSync(privateKeyPath, privateKey)
		return { publicKey, privateKey }
	}
}
