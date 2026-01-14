export const bigIntToString = (data: any): any => {
	if (typeof data === 'bigint') {
		return data.toString()
	}

	if (Array.isArray(data)) {
		return data.map((item) => bigIntToString(item))
	}

	if (data !== null && typeof data === 'object') {
		const converted: any = {}
		for (const key in data) {
			if (Object.prototype.hasOwnProperty.call(data, key)) {
				converted[key] = bigIntToString(data[key])
			}
		}
		return converted
	}

	return data
}
