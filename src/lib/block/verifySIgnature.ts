import { Block } from '../../model/blocks/block'
import { createVerify } from 'crypto'

const verifySign = (
	data: string | Block,
	signature: string,
	publicKey: string,
) => {
	const verify = createVerify('SHA256')
	const formatData = JSON.stringify(data)
	const bufferData = Buffer.from(formatData)
	verify.update(bufferData)
	verify.end()
	return verify.verify(
		{ key: publicKey, dsaEncoding: 'ieee-p1363' },
		signature,
		'hex',
	)
}
