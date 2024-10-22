export const toNxc = (nexu: number) => {
	return parseFloat((nexu / Math.pow(10, 18)).toFixed(18))
}
