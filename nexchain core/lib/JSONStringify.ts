import { stringify } from 'json-bigint'

export const JSONStringify = (data: any): string => {
	return stringify(data, null, 2)
}
