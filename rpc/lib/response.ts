import { RpcErrorResponse, RpcSuccessResponse } from 'interface/rpc/response'

// Factory functions
export const createSuccessResponse = <T>(
	id: string | number | null,
	result: T,
): RpcSuccessResponse<T> => ({
	jsonrpc: '2.0',
	id,
	result,
})

export const createErrorResponse = (
	id: string | number | null,
	code: number,
	message: string,
	data?: unknown,
): RpcErrorResponse => ({
	jsonrpc: '2.0',
	id,
	error: { code, message, data },
})
