export const base64ToUint8 = (data: string) => {
	return new Uint8Array(
		atob(data)
			.split('')
			.map((char) => char.charCodeAt(0)),
	)
}
