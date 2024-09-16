/** @format */

import { memPool } from '../model/memPool/memPool'
const transaction = new memPool()

export const getTransaction = () => {
	return transaction.getTransaction()
}
