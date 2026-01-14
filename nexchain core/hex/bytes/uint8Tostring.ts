export const uint8ToString = (data: Uint8Array): string => {
	if (!(data instanceof Uint8Array)) {
		return data
	}
	return new TextDecoder().decode(data)
}
