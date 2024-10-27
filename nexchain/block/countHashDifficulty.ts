export const countHashDifficulty = (hash: string) => {
	let count = 0
	while (hash[count] === '0') {
		count++
	}
	return count
}
