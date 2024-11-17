import { ContractBase } from './baseContract'
import { ContractUtils } from './contractUtil'

// Platform untuk menyimpan dan mengeksekusi kontrak
export class ExecPlatform {
	static contracts: Map<string, ContractBase> = new Map()

	// Menyimpan kontrak yang ditulis oleh pengguna
	static addContract(contract: ContractBase): void {
		if (ContractUtils.validateContract(contract)) {
			this.contracts.set(contract.contractId, contract)
			console.log(
				`Contract ${contract.contractId} has been added successfully.`,
			)
		}
	}

	// Mengeksekusi kontrak berdasarkan ID
	static executeContract(contractId: string): void {
		const contract = this.contracts.get(contractId)
		if (contract) {
			console.log(`Executing contract: ${contract.contractId}`)
			contract.execute()
		} else {
			console.log(`Contract with ID ${contractId} not found.`)
		}
	}
}
