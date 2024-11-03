import { NXC, contract } from 'interface/structContract'
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
	initialBalance: NXC,
): Promise<contract | undefined> => {
	const gas = toNexu(0.1)
	const isValidAddres = isValidAddress(owner)
	if (!isValidAddres) {
		console.error(`Invalid owner address`)
		return
	}
	const userBalance = await getBalance(owner).catch(() => null)
	if (userBalance!.balance < gas) {
		console.error(`Insufficient balance to deploy contract.`)
		return
	}
	await burnNexu(owner, gas)
	const nonce = await getOwnerNonce(owner)
	const contractAddress = createContractAdrress(owner, nonce)
	const txHash = await transferFunds({
		amount: initialBalance,
		receiver: contractAddress,
		sender: owner,
		format: 'NXC',
		timestamp: generateTimestampz(),
		fee: toNexu(0.05),
		extraData: 'Deploy contract',
	})
	const newContract: contract = {
		balance: initialBalance,
		contractAddress: createContractAdrress(owner, nonce),
		contractCodeHash: '',
		deploymentTransactionHash: txHash!,
		deployedAt: generateTimestampz(),
		owner: owner,
		metadata: {
			name: 'Contract',
			version: '0.1.0',
		},
		status: 'active',
	}
	newContract.contractCodeHash = sha256(
		JSON.stringify(newContract),
		'hex',
	) as string
	await mempool.addContract(newContract)
	return newContract
}
