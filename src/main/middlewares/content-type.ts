import { NextFunction, Request, Response } from 'express';

export function contentType(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.type('json');
  next();
}
