import { jsonRpcRequest } from 'client/rpc-client/rpcManage'

const rpc = new jsonRpcRequest()
const initCommon = async () => {
	await rpc.createWallet()
}
initCommon()

// console.log('Common initialized')
