import { contract } from 'interface/structContract'
import { createContractAdrress } from 'nexchain/lib/createContractAddress'
import { getOwnerNonce } from '../../../../contract/utils/getOwnerNonce'
import { sha256 } from 'nexchain/block/sha256'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { isValidAddress } from 'nexchain/transaction/utils/isValidAddress'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { burnNexu } from 'nexchain/transaction/burnNexu'
import { MemPool } from 'nexchain/model/memPool/memPool'
import { logToConsole } from 'logging/logging'
import { getAccount } from 'account/balance/getAccount'
import { sendTransactionToRpc } from 'client/rpc-client/controller/POST/sendTxToRpc'
import { createTransaction } from 'client/lib/createTransaction'

const mempool = new MemPool()

export const createContract = async (
	owner: string,
): Promise<{ status: boolean; contract?: contract | undefined }> => {
	const initialAmount = toNexu(1)
	let totalGas = 5000
	const isValidAddres = isValidAddress(owner)
	if (!isValidAddres) {
		console.error(`Invalid owner address`)
		return { status: false, contract: undefined }
	}
	const userBalance = await getAccount(owner).catch(() => null)
	if (userBalance!.balance < totalGas) {
		console.error(`Insufficient balance to deploy contract.`)
		return { status: false, contract: undefined }
	}
	await burnNexu(owner, totalGas)
	const nonce = await getOwnerNonce(owner)
	const contractAddress = createContractAdrress(owner, nonce)
	const txData = createTransaction({
		amount: initialAmount,
		receiver: contractAddress,
		sender: owner,
		format: 'nexu',
		timestamp: generateTimestampz(),
		fee: totalGas,
		extraMessage: 'Contract deploy',
	})
	const transact = await sendTransactionToRpc(txData.rawData!)
	const newContract: contract = {
		balance: 0,
		contractAddress: createContractAdrress(owner, nonce),
		contractCodeHash: '',
		deploymentTransactionHash: txData.txHash!,
		deployedAt: generateTimestampz(),
		owner: owner,
		metadata: {
			name: 'Contract',
			version: '0.1.0',
		},
		status: 'active',
		currency: 'nexu',
	}
	newContract.contractCodeHash = sha256(
		JSON.stringify(newContract),
		'hex',
	) as string
	if (!transact) return { status: false, contract: undefined }
	await mempool.addContract(newContract)
	logToConsole(
		`Your contract created waiting for mined. contract address : ${newContract.contractAddress} `,
	)
	return { status: true, contract: newContract }
}
