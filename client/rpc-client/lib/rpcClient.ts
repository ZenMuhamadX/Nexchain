import { JSONRPCClient } from 'json-rpc-2.0'

// JSONRPCClient needs to know how to send a JSON-RPC request.
// Tell it by passing a function to its constructor. The function must take a JSON-RPC request and send it.
export const client: JSONRPCClient = new JSONRPCClient((jsonRPCRequest) =>
	fetch('http://localhost:8000/rpc', {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(jsonRPCRequest),
	}).then((response) => {
		if (response.status === 200) {
			// Use client.receive when you received a JSON-RPC response.
			return response
				.json()
				.then((jsonRPCResponse) => client.receive(jsonRPCResponse))
		} else if (jsonRPCRequest.id !== undefined) {
			console.error({
				status: response.status,
				statusText: response.statusText,
			})
			return Promise.reject(new Error('JSON-RPC error'))
		} else if (response.status !== 200) {
			console.error({
				status: response.status,
				statusText: response.statusText,
			})
			return Promise.reject(new Error('JSON-RPC error'))
		}
		return
	}),
)
