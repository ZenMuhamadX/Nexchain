import { JSONRPCClient } from 'json-rpc-2.0'
import axios from 'axios'

const baseUrl = 'http://localhost:8000'

// JSONRPCClient configuration
export const rpcClient: JSONRPCClient = new JSONRPCClient(
	async (jsonRPCRequest) => {
		try {
			const response = await axios.post(`${baseUrl}/rpc`, jsonRPCRequest, {
				headers: {
					'Content-Type': 'application/json',
				},
				withXSRFToken: true,
				baseURL: baseUrl,
				method: 'POST',
				timeout: 10000,
				url: '/rpc',
				responseType: 'json',
			})

			// Pass response data back to the JSONRPCClient
			rpcClient.receive(response.data.data)
		} catch (error: any) {
			if (jsonRPCRequest.id !== undefined) {
				// Handle errors properly
				throw new Error(error.response?.statusText || error.message)
			}
			throw error
		}
	},
)
