export const uint8ToBase64 = (data: Uint8Array) => {
	return btoa(String.fromCharCode(...data))
}
