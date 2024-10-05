import WebSocket from 'ws'
import { getIpV4 } from '../utils/getIpV4'
import { COM } from '../interface/INTERFACE_COM'
import { getLatestBlock } from 'src/block/query/direct/getLatestBlock'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { generateNetworkId } from '../utils/getNetId'

const ws = new WebSocket.Server({ port: 8000 })

ws.on('connection', (socket) => {
	console.log('peer connected')
	socket.on('message', (instructions, isBinary) => {
		if (instructions.toString() === 'GET_LASTBLOCK' && isBinary === false) {
			const blockData = getLatestBlock(true)
			const response: COM = {
				type: 'GET_LASTBLOCK',
				header: {
					nodeId: generateNetworkId(),
					timestamp: generateTimestampz(),
					version: '0.1.0',
				},
				data: blockData,
			}
			socket.send(JSON.stringify(response))
		}
	})
	socket.on('close', () => {
		console.log('peer disconnected')
	})
})

ws.on('error', (err) => {
	console.error(err)
})

ws.on('listening', () => {
	console.log(`${getIpV4()}:8000`)
})

ws.on('close', () => {
	console.log('Client disconnected')
})
