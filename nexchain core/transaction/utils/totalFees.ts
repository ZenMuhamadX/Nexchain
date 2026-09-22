import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'
import _ from 'lodash'

export const calculateTotalFees = (transaction: TxInterfaceCore[]): bigint => {
	if (!transaction.length) return 0n
	return _.reduce(
		transaction,
		(total: bigint, transaction: TxInterfaceCore) => {
			return total + BigInt(transaction.fee!)
		},
		0n,
	)
}
