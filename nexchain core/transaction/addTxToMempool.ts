import { TxInterfaceCore } from 'interface/core/TxInterfaceCore'
import { MemPool } from 'nexchain core/model/memPool/memPool'

export const addTxToMempool = async (
	data: TxInterfaceCore,
): Promise<boolean> => {
	return (await new MemPool().addTransaction(data)).isValid
}
