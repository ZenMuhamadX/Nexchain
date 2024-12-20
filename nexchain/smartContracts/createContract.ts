import { contract } from 'interface/structContract'
import { createContractAdrress } from 'nexchain/lib/createContractAddress'
import { getOwnerNonce } from './utils/getOwnerNonce'
import { sha256 } from 'nexchain/block/sha256'
import { generateTimestampz } from 'nexchain/lib/generateTimestampz'
import { isValidAddress } from 'nexchain/transaction/utils/isValidAddress'
import { toNexu } from 'nexchain/nexucoin/toNexu'
import { getBalance } from 'nexchain/account/balance/getBalance'
import { burnNexu } from 'nexchain/transaction/burnNexu'
import { transferFunds } from 'nexchain/transaction/transferFunds'
import { MemPool } from 'nexchain/model/memPool/memPool'
const mempool = new MemPool()

export const createContract = async (
	owner: string,
): Promise<{ status: boolean; contract?: contract | undefined }> => {
	const initialAmount = toNexu(0.01)
	let totalGas = 10000
	const isValidAddres = isValidAddress(owner)
	if (!isValidAddres) {
		console.error(`Invalid owner address`)
		return { status: false, contract: undefined }
	}
	const userBalance = await getBalance(owner).catch(() => null)
	if (userBalance!.balance < totalGas) {
		console.error(`Insufficient balance to deploy contract.`)
		return { status: false, contract: undefined }
	}
	await burnNexu(owner, (totalGas -= 5000))
	const nonce = await getOwnerNonce(owner)
	const contractAddress = createContractAdrress(owner, nonce)
	const transferStatus = await transferFunds({
		amount: initialAmount,
		receiver: contractAddress,
		sender: owner,
		format: 'nexu',
		timestamp: generateTimestampz(),
		fee: totalGas,
		extraData: 'Contract deploy',
	})
	const newContract: contract = {
		balance: 0,
		contractAddress: createContractAdrress(owner, nonce),
		contractCodeHash: '',
		deploymentTransactionHash: transferStatus.txHash!,
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
	if (!transferStatus.status) return { status: false, contract: undefined }
	await mempool.addContract(newContract)
	console.info(
		`Your contract created waiting for mined. contract address : ${newContract.contractAddress} `,
	)
	return { status: true, contract: newContract }
}
