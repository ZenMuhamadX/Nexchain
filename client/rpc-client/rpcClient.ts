import { JSONRPCClient } from 'json-rpc-2.0'
import axios from 'axios'

const baseUrl = 'http://localhost:8000'

// JSONRPCClient configuration
export const rpcClient: JSONRPCClient = new JSONRPCClient(
	async (jsonRPCRequest) => {
		try {
			// Kirim permintaan ke server
			const response = await axios.post(`${baseUrl}/rpc`, jsonRPCRequest, {
				headers: {
					'Content-Type': 'application/json',
				},
				withXSRFToken: true,
				timeout: 10000,
			})

			// Serahkan respons ke JSONRPCClient
			return rpcClient.receive(response.data)
		} catch (error: any) {
			if (jsonRPCRequest.id !== undefined) {
				// Tangani error jika ada ID dalam request
				throw new Error(error.response?.statusText || error.message)
			}
		}
	},
)
