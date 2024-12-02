import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { limiter } from 'rpc/middleware/limiter'
import { rpc } from 'rpc/rpc'
import { logRequest } from 'rpc/middleware/logging'

const app = express()

app.use(helmet())
app.use(
	cors({
		credentials: true,
		methods: 'POST',
		allowedHeaders: ['Content-Type'],
		origin: '*', // Mengizinkan semua domain untuk mengakses API
	}),
)
app.use(express.json({ limit: '10kb' }))
app.use(limiter)
app.use(logRequest)

// Route utama
app.post('/rpc', async (req, res): Promise<any> => {
	try {
		const jsonRPCRequest = req.body

		// Pastikan input JSON RPC sesuai spesifikasi (opsional)
		if (!jsonRPCRequest || typeof jsonRPCRequest !== 'object') {
			return res.status(400).json({
				ok: false,
				error: 'Invalid JSON-RPC request format',
				data: null,
			})
		}

		// Proses JSON-RPC request
		const jsonRPCResponse = await rpc.receive(jsonRPCRequest)
		if (jsonRPCResponse) {
			res.status(200).json(jsonRPCResponse)
		} else {
			// Jika JSON-RPC notification, respons tanpa konten (204)
			res
				.status(400)
				.json({ ok: false, error: 'Invalid JSON-RPC request method' })
		}
	} catch (error) {
		console.error('Error handling RPC request:', error)
		// Menambahkan respons error yang lebih aman
		res.status(500).json({ error: 'Internal server error' })
	}
})

export { app }
