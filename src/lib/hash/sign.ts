import { createSign } from 'crypto'
import { Block } from '../../model/blocks/block'

export const sign = (dataOrAddres: string | Block, privateKey: string) => {
	const formatData = JSON.stringify(dataOrAddres)
	const bufferData = Buffer.from(formatData)
	const sign = createSign('SHA256')
	sign.update(bufferData)
	sign.end()
	return sign.sign({ key: privateKey, dsaEncoding: 'ieee-p1363' }, 'hex')
}
