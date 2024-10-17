import WebSocket from 'ws'
import { COM } from '../interface/COM'
import { myWalletAddress } from 'nexchain/account_based/myWalletAddress'
import { generateTimestampz } from 'nexchain/lib/timestamp/generateTimestampz'
import { generateMessageId } from '../utils/getMessageId'
import { comTxInterface } from 'nexchain/model/interface/commonTxInterface'

// Ganti dengan port node yang sesuai
const nodePort = 3002
const ws = new WebSocket(`ws://localhost:${nodePort}`)

const tx: comTxInterface = {
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
