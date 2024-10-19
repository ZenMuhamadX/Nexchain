import { txInterface } from 'interface/Nexcoin.inf'
import _ from 'lodash'

export const calculateTotalFees = (transaction: txInterface[]): number => {
	if (!transaction.length) return 0
	return _.reduce(
		transaction,
		(total, transaction) => {
			return total + transaction.fee!
		},
		0,
	)
}
