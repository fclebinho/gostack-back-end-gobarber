import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { ApplicationError } from '../errors/application-error';
import authConfig from '../config/authentication';
import User from '../models/user';

interface SessionRequest {
  email: string;
  password: string;
}

interface SessionResponse {
  user: User;
  token: string;
}

export class SessionCreateService {
  public async execute({
    email,
    password,
  }: SessionRequest): Promise<SessionResponse> {
    const repository = getRepository(User);

    const user = await repository.findOne({
      where: { email },
    });

    if (!user) {
      throw new ApplicationError('Incorrect email/password combination.', 401);
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched) {
      throw new ApplicationError('Incorrect email/password combination.', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default SessionCreateService;
