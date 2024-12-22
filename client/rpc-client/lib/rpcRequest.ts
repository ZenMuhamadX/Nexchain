import { client } from './rpcClient'

export const rpcRequest = async (method: string, params: any) => {
	return await client.request(method, params)
}
