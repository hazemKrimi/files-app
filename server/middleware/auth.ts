import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (!req.headers) throw new Error();
		else if (!req.headers['authorization']) throw new Error();
		else {
			const user = verify(req.headers['authorization'].split(' ')[1], 'SECRET');
			if (!user) throw new Error();
			else {
				req.user = user as { id: string };
				next();
			}
		}
	} catch {
		next();
	}
};
