import { parse } from 'json-bigint'

export const JSONParse = (data: string): any => {
	return parse(data)
}
