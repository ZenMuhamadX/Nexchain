import WebSocket from 'ws'
import { COM } from '../interface/INTERFACE_COM'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'

const ws = new WebSocket.Server({ port: 8000 })

ws.on('connection', (socket) => {
	console.log('peer connected')
	const message: COM = {
		type: 'CHECK',
		header: {
			nodeId: 0,
			timestamp: generateTimestampz(),
			version: '1.0.0',
		},
		data: 'ok',
	}
	socket.on('message', (data) => {
		if (data.toString() === 'ping') {
			socket.send('pong')
		} else if (data.toString() === 'check') {
			socket.send(JSON.stringify(message))
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
	console.log('listen on port 8000')
})

ws.on('close', () => {
	console.log('Client disconnected')
})
