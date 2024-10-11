import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { createTransact } from 'src/transaction/createTransact'
import WebSocket, { WebSocketServer } from 'ws'
import winston from 'winston'
import * as path from 'path'
import { getNetworkId } from '../utils/getNetId'
import { COM } from '../interface/COM'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { miningBlock } from 'src/miner/mining'
import { validateMessageInterface } from './validateInf'
import { leveldb } from 'src/leveldb/init'

// Konfigurasi logger
const logger = winston.createLogger({
	level: 'info',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json(),
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			filename: path.join(__dirname, '../../../logs', 'node.log'),
		}),
	],
})

export class Node {
	private port: number
	private peers: WebSocket[] = []
	private peerIds: Set<string> = new Set() // Set untuk menyimpan ID peer yang terhubung
	private server: WebSocketServer
	public id: string // ID unik untuk setiap node

	constructor(port: number) {
		this.port = port
		this.id = getNetworkId() // Generate a unique ID for the node
		this.server = new WebSocketServer({ port: this.port })
		this.initServer()
		this.loadPeerList() // Memuat daftar peer saat inisialisasi
		logger.info(`Node ${this.id} running on port ${this.port}`)
	}

	// Inisialisasi WebSocket server untuk menerima koneksi dari peer lain
	private initServer() {
		this.server.on('connection', (ws: WebSocket) => {
			logger.info(`Node ${this.id} connected to peer on port ${this.port}`)

			// Saat menerima pesan dari peer
			ws.on('message', (message: string) => {
				const data = JSON.parse(message)
				this.handleMessage(data)
			})

			// Saat koneksi ditutup
			ws.on('close', () => {
				logger.info(`Connection closed on node ${this.id} (port ${this.port})`)
				this.savePeerList() // Simpan daftar peer saat koneksi terputus
				this.reconnectToPeers() // Coba untuk menghubungkan kembali ke peers
			})
		})
	}

	// Koneksikan node ke peer lain
	public connectToPeer(port: number) {
		const peerAddress = `ws://localhost:${port}`
		const ws = new WebSocket(peerAddress)

		ws.on('open', () => {
			logger.info(`Node ${this.id} connected to peer at ${peerAddress}`)
			this.peers.push(ws) // Tambahkan peer ke daftar peers
			this.peerIds.add(port.toString()) // Tambahkan ID node peer yang terhubung
			this.savePeerList() // Simpan ID ke LevelDB
			this.broadcastPeerIds() // Broadcast ID ke semua peer
		})

		ws.on('message', (message: string) => {
			const data = JSON.parse(message)
			this.handleMessage(data)
		})

		ws.on('close', () => {
			logger.info(`Node ${this.id} disconnected from peer at ${peerAddress}`)
			this.peers = this.peers.filter((peer) => peer !== ws) // Hapus peer dari daftar jika koneksi terputus
			this.peerIds.delete(port.toString()) // Hapus ID node peer dari set
			this.broadcastPeerIds() // Broadcast ID yang terhubung yang diperbarui
		})
	}

	// Memuat daftar peer dari LevelDB
	private async loadPeerList() {
		try {
			const peers = await leveldb.get('peerList')
			if (peers) {
				const ids = JSON.parse(peers)
				ids.forEach((id: string) => {
					this.connectToPeer(Number(id)) // Coba menghubungkan ke setiap peer
				})
			}
		} catch (err) {
			logger.error(`Error loading peer list: ${err}`)
		}
	}

	// Menyimpan daftar peer ke LevelDB
	private async savePeerList() {
		try {
			await leveldb.put('peerList', JSON.stringify(Array.from(this.peerIds)))
		} catch (err) {
			logger.error(`Error saving peer list: ${err}`)
		}
	}

	// Mencoba menghubungkan kembali ke peers yang ada
	private reconnectToPeers() {
		this.peerIds.forEach((peerId) => {
			this.connectToPeer(Number(peerId)) // Coba hubungkan kembali ke setiap peer
		})
	}

	// Broadcast ID semua peer yang terhubung
	private broadcastPeerIds() {
		this.broadcast({
			type: 'PEERS_ID',
			payload: Array.from(this.peerIds),
			nodeSender: this.id,
			timestamp: generateTimestampz(),
		})
	}

	// Fungsi untuk mem-broadcast pesan ke semua peer
	private broadcast(data: COM) {
		this.peers.forEach((peer) => {
			peer.send(JSON.stringify(data))
		})
	}

	// Fungsi untuk menangani pesan yang diterima dari node lain
	private handleMessage(data: COM) {
		if (!validateMessageInterface(data)) {
			logger.error('Invalid message format, check logs for details')
			return
		}
		switch (data.type) {
			case 'CREATE_TRANSACTION':
				data.nodeSender = this.id
				data.timestamp = generateTimestampz()
				this.addNewTransaction(data.payload)
				break
			case 'PEERS_ID':
				this.handlePeerIds(data.payload)
				break
			case 'GREETING': // Menangani pesan dari client
				logger.info(`Node ${this.id} received greeting:`, data)
				break
			case 'MINE':
				miningBlock(data.payload)
				logger.info(`Node ${this.id} received mining request:`, data)
				break
			case 'REQ_BLOCK':
				logger.info(`Node ${this.id} received request for block:`, data)
				break
			default:
				logger.warn(`Node ${this.id}: Unknown message type:`, data.type)
		}
	}

	// Menangani ID peer yang diterima
	private handlePeerIds(ids: string[]) {
		ids.forEach((id) => this.peerIds.add(id)) // Tambahkan ID baru yang diterima
		logger.info(`Node ${this.id} updated peer IDs:`, Array.from(this.peerIds))
	}

	// Menambahkan transaksi baru ke mempool dan broadcast ke semua peer
	public addNewTransaction(transaction: MemPoolInterface) {
		this.broadcast({
			type: 'CREATE_TRANSACTION',
			nodeSender: this.id,
			payload: transaction,
			timestamp: generateTimestampz(),
		})
		createTransact(transaction)
			.then(() => {
				logger.info(
					`Node ${this.id}: New transaction added to mempool:`,
					transaction,
				)
			})
			.catch((err) => {
				logger.error(
					`Node ${this.id}: Error adding transaction to mempool:`,
					err,
				)
			})
	}
}
