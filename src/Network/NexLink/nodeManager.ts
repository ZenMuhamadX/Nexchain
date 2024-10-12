import WebSocket, { WebSocketServer } from 'ws'
import winston from 'winston'
import * as path from 'path'
import { getNetworkId } from '../utils/getNetId'
import { COM } from '../interface/COM'
import { miningBlock } from 'src/miner/mining'
import { validateMessageInterface } from './validateInf'
import { leveldb } from 'src/leveldb/init'
import { generateMessageId } from '../utils/getMessageId'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { createTransact } from 'src/transaction/createTransact'

// Logger configuration
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
	private peerIds: Set<string> = new Set() // Set to store connected peer IDs
	private server: WebSocketServer
	public id: string // Unique ID for each node
	private processedMessages: Set<string> = new Set() // To track processed messages

	constructor(port: number) {
		this.port = port
		this.id = getNetworkId() // Generate a unique ID for the node
		this.server = new WebSocketServer({ port: this.port })
		this.initServer()
		this.loadPeerList() // Load peer list on initialization
		logger.info(`Node ${this.id} running on port ${this.port}`)
	}

	// Initialize WebSocket server to accept connections from other peers
	private initServer() {
		this.server.on('connection', (ws: WebSocket) => {
			logger.info(`Node ${this.id} connected to peer on port ${this.port}`)

			// Handle incoming messages from peers
			ws.on('message', (message: string) => {
				this.handleIncomingMessage(message)
			})

			// Handle connection close
			ws.on('close', () => {
				logger.info(`Connection closed on node ${this.id} (port ${this.port})`)
				this.savePeerList() // Save peer list on disconnect
				this.reconnectToPeers() // Attempt to reconnect to peers
			})

			// Handle connection errors
			ws.on('error', (error) => {
				logger.error(`WebSocket error: ${error.message}`)
			})
		})
	}

	// Handle incoming messages safely
	private handleIncomingMessage(message: string) {
		try {
			const data = JSON.parse(message)
			this.checkMessageStatus(data)
		} catch (err) {
			logger.error(`Failed to parse message: ${message}, error: ${err}`)
		}
	}

	// Connect to another peer
	public connectToPeer(port: number) {
		const peerAddress = `ws://localhost:${port}`
		const ws = new WebSocket(peerAddress)

		ws.on('open', () => {
			logger.info(`Node ${this.id} connected to peer at ${peerAddress}`)
			this.peers.push(ws)
			this.peerIds.add(port.toString())
			this.savePeerList()
			this.broadcastPeerIds()
		})

		ws.on('message', (message: string) => {
			this.handleIncomingMessage(message)
		})

		ws.on('close', () => {
			logger.info(`Node ${this.id} disconnected from peer at ${peerAddress}`)
			this.peers = this.peers.filter((peer) => peer !== ws)
			this.peerIds.delete(port.toString())
			this.broadcastPeerIds()
		})

		// Handle connection errors
		ws.on('error', (error) => {
			logger.error(`Connection error to peer ${peerAddress}: ${error.message}`)
		})
	}

	// Load peer list from LevelDB
	private async loadPeerList() {
		try {
			const peers = await leveldb.get('peerList')
			if (peers) {
				const ids = JSON.parse(peers)
				for (const id of ids) {
					this.connectToPeer(Number(id))
				}
			}
		} catch (err) {
			logger.error(`Error loading peer list: ${err}`)
		}
	}

	// Save peer list to LevelDB
	private async savePeerList() {
		try {
			await leveldb.put('peerList', JSON.stringify(Array.from(this.peerIds)))
		} catch (err) {
			logger.error(`Error saving peer list: ${err}`)
		}
	}

	// Attempt to reconnect to existing peers with a delay
	private reconnectToPeers() {
		this.peerIds.forEach((peerId) => {
			setTimeout(() => {
				this.connectToPeer(Number(peerId))
			}, 5000) // Delay for 5 seconds before reconnecting
		})
	}

	// Broadcast all connected peer IDs
	private broadcastPeerIds() {
		const parsedData: COM = {
			type: 'PEERS_ID',
			payload: { data: Array.from(this.peerIds) },
			isClient: false,
			forwardCount: 0,
			messageId: generateMessageId(),
			timestamp: generateTimestampz(),
		}
		this.broadcast(parsedData)
	}
	private broadcast(data: COM) {
		data.forwardCount = (data.forwardCount || 0) + 1 // Increment forwardCount
		this.peers.forEach((peer) => {
			if (peer.readyState === WebSocket.OPEN) {
				peer.send(JSON.stringify(data))
			}
		})
	}

	private checkMessageStatus(data: COM) {
		// 1. Validasi format pesan
		if (!validateMessageInterface(data)) {
			logger.error('Invalid message format, check logs for details')
			return
		}

		const maxForwardCount = 2 // Set the maximum forward count

		// 2. Cek duplikasi
		if (this.processedMessages.has(data.messageId)) {
			logger.warn(`Duplicate message received: ${data.messageId}`)
			return
		}

		// 3. Cek forwardCount
		if (data.forwardCount && data.forwardCount > maxForwardCount) {
			logger.warn(`Message ${data.messageId} exceeded forward limit.`)
			return
		}

		// 4. Tandai pesan sebagai diproses
		this.processedMessages.add(data.messageId)

		// 5. Penanganan perintah klien
		if (data.isClient) {
			this.handleClientCommand(data)
			return
		}

		logger.info(`Node ${this.id} received message from peer`)
	}

	private handleClientCommand(data: COM) {
		if (data.isClient) {
			this.broadcast(data) // Broadcast to all peers
			logger.info(`Node ${this.id} processing command from client:`, data)
			// Handle message types
			switch (data.type) {
				case 'CREATE_TRANSACTION':
					this.handleCreateTransaction(data)
					break
				case 'PEERS_ID':
					this.handlePeerIds(data.payload.data)
					break
				case 'GREETING':
					logger.info(`Node ${this.id} received greeting:`, data)
					break
				case 'MINE':
					this.handleMiningRequest(data)
					break
				case 'REQ_BLOCK':
					logger.info(`Node ${this.id} received request for block:`, data)
					break
				default:
					logger.warn(`Node ${this.id}: Unknown message type:`, data.type)
			}
		}
	}

	// Handle transaction creation
	private handleCreateTransaction(data: COM) {
		createTransact(data.payload.data)
			.then(() => {
				logger.info(`Transaction processed: ${data.payload.data}`)
			})
			.catch((err) => {
				logger.error(`Transaction processing error: ${err}`)
			})
	}

	// Handle mining request
	private handleMiningRequest(data: COM) {
		miningBlock(data.payload.data)
		logger.info(`Node ${this.id} received mining request:`, data)
	}

	// Handle received peer IDs
	private handlePeerIds(ids: string[]) {
		ids.forEach((id) => this.peerIds.add(id)) // Add new peer IDs
		logger.info(`Node ${this.id} updated peer IDs:`, Array.from(this.peerIds))
	}
}
