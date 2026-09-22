import { NextFunction, Request, Response } from 'express'
import { logToConsole } from 'logging/logging'

export const logRequest = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	logToConsole(`${req.method} ${req.path} Rpc-Method:${req.body.method}`)
	next()
}
