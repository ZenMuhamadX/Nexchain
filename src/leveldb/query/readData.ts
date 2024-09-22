import { leveldb } from '../init'

export const readData = async (key: string) => {
	try {
        console.log(leveldb.status);
		const value = await leveldb.get(key)
		console.log('key :>> ', value)
	} catch (error) {
		if (error instanceof Error && error.name === 'NotFound') {
			console.log('not found')
		}
		console.log(error)
	}
}
