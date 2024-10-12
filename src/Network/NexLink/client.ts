import WebSocket from 'ws'
import { COM } from '../interface/COM'
import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { myWalletAddress } from 'src/wallet/myWalletAddress'

// Ganti dengan port node yang sesuai
const nodePort = 3002
const ws = new WebSocket(`ws://localhost:${nodePort}`)

const tx: MemPoolInterface = {
	amount: 20,
	from: myWalletAddress(),
	to: 'x',
}

ws.on('open', () => {
	console.log(`Connected to node on port ${nodePort}`)

	// Mengirimkan pesan sekali
	const message: COM = {
		type: 'CREATE_TRANSACTION', // Ganti dengan 'CREATE_TRANSACTION' jika perlu
		payload: { data: tx },
		isClient: true,
		forwardCount: 0,
		messageId: '123',
		timestamp: 123,
	}
	ws.send(JSON.stringify(message))
	ws.close()
})
