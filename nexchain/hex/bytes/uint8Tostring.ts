export const uint8ToString = (data: Uint8Array): string => {
	return new TextDecoder().decode(data)
}
