export const stringToUint8 = (data: string): Uint8Array => {
	return new TextEncoder().encode(data)
}
