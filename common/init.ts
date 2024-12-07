import { jsonRpcRequest } from 'client/rpc-client/rpcManage'

const rpc = new jsonRpcRequest()
rpc.createWallet().then(console.log)
