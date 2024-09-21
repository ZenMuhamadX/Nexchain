export interface defaultConfig {
	network: {
		port: number
		host: string
		protocol: string
	}
	block: {
		maxBlockSize: number
		nodeVer: string
	}
	memPool: {
		maxMempoolSize: number
		maxVer: number
	}
	logging: {
		level: string
		path: string
	}
	wallet: {
		path: string
		version: number
		privateKeyEncrypt: {
			algorithm: string
			keySize: number
		}
	}
}
