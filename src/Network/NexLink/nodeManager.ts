import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { createTransact } from 'src/transaction/createTransact'
import WebSocket, { WebSocketServer } from 'ws'

export class Node {
	private port: number
	private peers: WebSocket[] = []
	private server: WebSocketServer

	constructor(port: number) {
		this.port = port
		this.server = new WebSocketServer({ port: this.port })
		this.initServer()
		console.log(`Node running on port ${this.port}`)
	}

	// Inisialisasi WebSocket server untuk menerima koneksi dari peer lain
	private initServer() {
		this.server.on('connection', (ws: WebSocket) => {
			console.log(`Node connected to peer on port ${this.port}`)

			// Saat menerima pesan dari peer
			ws.on('message', (message: string) => {
				const data = JSON.parse(message)
				this.handleMessage(data)
			})

			// Saat koneksi ditutup
			ws.on('close', () => {
				console.log(`Connection closed on port ${this.port}`)
			})
		})
	}

	// Koneksikan node ke peer lain
	public connectToPeer(port: number) {
		const peerAddress = `ws://localhost:${port}`
		const ws = new WebSocket(peerAddress)

		ws.on('open', () => {
			console.log(`Connected to peer at ${peerAddress}`)
			this.peers.push(ws) // Tambahkan peer ke daftar peers
		})

		ws.on('message', (message: string) => {
			const data = JSON.parse(message)
			this.handleMessage(data)
		})

		ws.on('close', () => {
			console.log(`Disconnected from peer at ${peerAddress}`)
			this.peers = this.peers.filter((peer) => peer !== ws) // Hapus peer dari daftar jika koneksi terputus
		})
	}

	// Fungsi untuk mem-broadcast pesan ke semua peer
	private broadcast(data: any) {
		this.peers.forEach((peer) => {
			peer.send(JSON.stringify(data))
		})
	}

	// Fungsi untuk menangani pesan yang diterima dari node lain
	private handleMessage(data: any) {
		switch (data.type) {
			case 'transaction':
				this.addNewTransaction(data.transaction)
				break
			default:
				console.log('Unknown message type:', data.type)
		}
	}

	// Menambahkan transaksi baru ke mempool dan broadcast ke semua peer
	public addNewTransaction(transaction: MemPoolInterface) {
		createTransact(transaction)
			.then(() => {
				console.log('New transaction added to mempool:', transaction)
				this.broadcast({ type: 'transaction', transaction })
			})
			.catch((err) => {
				console.log(err)
			})
	}
}
