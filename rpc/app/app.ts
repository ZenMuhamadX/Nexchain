import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { limiter } from 'rpc/middleware/limiter'
import { rpc } from 'rpc/method'
import { logRequest } from 'rpc/middleware/logging'
import { createSuccessResponse, createErrorResponse } from 'rpc/lib/response' // Import the response functions

const app = express()

app.use(helmet())
app.use(
	cors({
		credentials: true,
		methods: 'POST',
		allowedHeaders: ['Content-Type'],
		origin: '*',
	}),
)
app.use(express.json({ limit: '10Mb' }))
app.use(limiter)
app.use(logRequest)

app.get('/', (_req, res) => {
	res.status(200).json({ rpc_status: 'OK' })
})

app.post('/rpc', async (req, res): Promise<any> => {
	try {
		const jsonRPCRequest = req.body

		if (!jsonRPCRequest || typeof jsonRPCRequest !== 'object') {
			return res.status(400).json(createErrorResponse(null, -32600, 'Invalid JSON-RPC request format'))
		}

		const jsonRPCResponse = await rpc.receive(jsonRPCRequest)
		if (jsonRPCResponse) {
			res.status(200).json(createSuccessResponse(jsonRPCRequest.id, jsonRPCResponse))
		} else {
			res.status(400).json(createErrorResponse(jsonRPCRequest.id, -32601, 'Invalid JSON-RPC request method'))
		}
	} catch (error) {
		console.error('Error handling RPC request:', error)
		res.status(500).json(createErrorResponse(null, -32000, 'Internal server error'))
	}
})

export { app }
