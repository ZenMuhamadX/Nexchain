import WebSocket from 'ws'

const wss = new WebSocket.Server({ port: 445 })

wss.on('connection', (ws) => {
	console.log('Client connected')
	ws.on('message', (message) => {
		console.log(`Received message: ${message}`)
		ws.send(`You sent: ${message}`)
	})
})
wss.on('close', () => {
	console.log('Client disconnected')
})

console.log('Server started on port 445')
