import { TxInterface } from 'interface/structTx'
import { MemPool } from 'nexchain/model/memPool/memPool'

export const addTxToMempool = async (data: TxInterface): Promise<boolean> => {
	return (await new MemPool().addTransaction(data)).isValid
}
