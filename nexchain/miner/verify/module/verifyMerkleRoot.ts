/**
 * Verifies if the provided Merkle Root is correct for the given transactions.
 * @param transactions - The transactions included in the block.
 * @param providedMerkleRoot - The Merkle Root stored in the block.
 * @returns True if the Merkle Root is valid, otherwise false.
 */

import { TxInterface } from 'interface/structTx'
import { createMerkleRoot } from 'nexchain/transaction/utils/createMerkleRoot'

export function verifyMerkleRoot(
	transactions: TxInterface[],
	providedMerkleRoot: string,
): boolean {
	// Recalculate the Merkle Root from the transactions.
	const recalculatedMerkleRoot = createMerkleRoot(transactions)

	// Compare it to the provided Merkle Root.
	return recalculatedMerkleRoot === providedMerkleRoot
}
