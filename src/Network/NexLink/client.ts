import WebSocket from 'ws'
import { COM } from '../interface/COM'
import { MemPoolInterface } from 'src/model/interface/memPool.inf'
import { myWalletAddress } from 'src/wallet/myWalletAddress'
import { getLatestBlock } from 'src/block/query/direct/getLatestBlock'
import { getBalance } from 'src/wallet/balance/getBalance'

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
	}
	ws.send(JSON.stringify(message))
	ws.close()
})
