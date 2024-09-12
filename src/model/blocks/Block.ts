import { TxBlock, TxInterface } from './TxBlock'

interface walletData {
	address: string
	balance: number
	signature: string
}

// models/Block.ts
// Kelas ini merepresentasikan blok dalam blockchain
export class Block {
	// Indeks blok dalam blockchain
	public readonly index: number
	// Timestamp blok
	public readonly timestamp: string
	// Data yang akan disimpan dalam blok
	public readonly walletData: walletData[]
	// Transaksi yang termasuk dalam blok
	public readonly transactions: TxInterface[] | TxBlock[]
	// Hash dari blok sebelumnya dalam blockchain
	public readonly previousHash: string
	// Hash dari blok ini
	public hash: string
	// Signature
	public signature: string
	// Nonce
	public nonce?: number
	// reward
	private readonly reward: number
	// version
	public readonly version: string = '1.0.0'

	// Konstruktor untuk kelas Block
	constructor(
		index: number,
		timestamp: string,
		transactions: TxInterface[],
		previousHash: string,
		validHash: string,
		signature: string,
		walletData: walletData[],
		nonce?: number,
	) {
		// Menginisialisasi properti dari konstruktor
		this.index = index
		this.timestamp = timestamp
		this.transactions = transactions
		this.previousHash = previousHash
		// Menghasilkan hash blok
		this.hash = validHash

		this.walletData = walletData!
		// Menambahkan tanda tangan (signature)
		this.signature = signature
		// Menambahkan nonce (opsional)
		this.nonce = nonce
		// reward
		this.reward = 50
	}
}
