import WebSocket from 'ws'
import { COM } from '../interface/COM'
import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { myWalletAddress } from 'src/wallet/myWalletAddress'
import { generateTimestampz } from 'src/lib/timestamp/generateTimestampz'
import { generateMessageId } from '../utils/getMessageId'

// Ganti dengan port node yang sesuai
const nodePort = 3002
const ws = new WebSocket(`ws://localhost:${nodePort}`)

const tx: MemPoolInterface = {
	amount: 20,
	from: myWalletAddress(),
	to: 'x',
	timestamp: generateTimestampz(),
}

ws.on('open', () => {
	console.log(`Connected to node on port ${nodePort}`)

	// Mengirimkan pesan sekali
	const message: COM = {
		type: 'CREATE_TRANSACTION',
		payload: { data: tx },
		isClient: true,
		forwardCount: 0,
		messageId: generateMessageId(),
		timestamp: 123,
	}
	ws.send(JSON.stringify(message))
	ws.close()
})
