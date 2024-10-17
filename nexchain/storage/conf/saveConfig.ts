import path from 'path'
import fs from 'fs'
import { defaultConfig } from '../../model/interface/defaultConf.inf'

export const saveConfigFile = () => {
	const dirPath = path.join(__dirname, '../../../config')
	const filePath = path.join(dirPath, 'chains.config.json')

	const defaultConfig: defaultConfig = {
		network: {
			port: 4040,
			host: 'localhost',
			protocol: 'http',
		},
		block: {
			maxBlockSize: 2048,
			nodeVer: '1.0.0',
		},
		memPool: {
			maxMempoolSize: 5,
			maxVer: 5,
		},
		logging: {
			level: 'info',
			path: path.join(__dirname, '../../logs'),
		},
		wallet: {
			path: path.join(__dirname, '../../myWallet/MainWallet.bin'),
			privateKeyEncrypt: {
				algorithm: 'aes-256-cbc',
				keySize: 256,
			},
		},
	}
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true })
	}
	fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 4))
}