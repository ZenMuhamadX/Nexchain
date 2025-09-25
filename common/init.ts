import { jsonRpcRequest } from 'rpc/rpc-client/rpcManage'

const rpc = new jsonRpcRequest()
const initCommon = async () => {
	await rpc.createWallet()
}
initCommon()
