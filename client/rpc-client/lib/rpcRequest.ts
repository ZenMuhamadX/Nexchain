import { client } from './rpcClient'

export const rpcRequest = async (method: string, params: any) => {
	const data = await client.request(method, params)
	return data
}
