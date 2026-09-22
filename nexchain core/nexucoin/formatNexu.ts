export const formatNexu = (amountNexu: number, decimal: number = 8): string => {
	const nxc = Number(amountNexu) / 10 ** 18
	return nxc.toFixed(decimal) + ' NXC'
}
