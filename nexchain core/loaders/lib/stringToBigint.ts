export const stringToBigInt = (data: any, keys?: string[]): any => {
	if (typeof data === 'string' && /^\d+$/.test(data)) {
		return BigInt(data)
	}

	if (Array.isArray(data)) {
		return data.map((item) => stringToBigInt(item, keys))
	}

	if (data !== null && typeof data === 'object') {
		const converted: any = {}
		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				converted[key] = stringToBigInt(data[key], keys)
			}
		}
		return converted
	}

	return data
}
