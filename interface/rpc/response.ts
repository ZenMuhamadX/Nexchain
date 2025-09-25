// Response base structure
interface RpcError {
	code: number
	message: string
	data?: unknown
}

interface RpcResponse<T = unknown> {
	jsonrpc: string
	id: string | number | null
	result?: T
	error?: RpcError
}

// Success response
export interface RpcSuccessResponse<T = unknown> extends RpcResponse<T> {
	result: T
	error?: never
}

// Error response
export interface RpcErrorResponse extends RpcResponse {
	error: RpcError
	result?: never
}

// Standard JSON-RPC error codes
export const RPC_ERROR_CODES = {
	PARSE_ERROR: -32700,
	INVALID_REQUEST: -32600,
	METHOD_NOT_FOUND: -32601,
	INVALID_PARAMS: -32602,
	INTERNAL_ERROR: -32603,
	SERVER_ERROR_START: -32099,
	SERVER_ERROR_END: -32000,
} as const

// Helper types
export type RpcResponseType<T> = RpcSuccessResponse<T> | RpcErrorResponse
