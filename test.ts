import { jsonRpcRequest } from 'client/rpc-client/rpcManage'

const rpc = new jsonRpcRequest()
rpc.getCurrentBlock().then(console.log)
