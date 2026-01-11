import { nexu } from 'interface/structContract'
import { TxInterface } from 'interface/structTx'
import _ from 'lodash'

export const calculateTotalFees = (transaction: TxInterface[]): nexu => {
	if (!transaction.length) return 0
	return _.reduce(
		transaction,
		(total, transaction) => {
			return total + transaction.fee!
		},
		0,
	)
}
