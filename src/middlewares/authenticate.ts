import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { ApplicationError } from '../errors/application-error';
import authConfig from '../config/authentication';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export const authenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const header = request.headers.authorization;

  if (!header) {
    throw new ApplicationError('Token is missing.', 401);
  }

  const [, token] = header.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (error) {
    throw new ApplicationError('Token is invalid.', 401);
  }
};

export default authenticated;
