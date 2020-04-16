import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import { ApplicationError } from '../errors/application-error';
import uploadConfig from '../config/upload';
import User from '../models/user';

interface UserRequest {
  user_id: string;
  avatar_file_name: string;
}

export class UserUpdateAvatarService {
  public async execute({
    user_id,
    avatar_file_name,
  }: UserRequest): Promise<User> {
    const repository = getRepository(User);

    const user = await repository.findOne(user_id);

    if (!user) {
      throw new ApplicationError('Only authenticated users can change avatar.');
    }

    if (user.avatar) {
      const filePath = path.join(uploadConfig.directory, user.avatar);
      const exists = await fs.promises.stat(filePath);

      if (exists) {
        await fs.promises.unlink(filePath);
      }
    }

    user.avatar = avatar_file_name;
    await repository.save(user);

    return user;
  }
}

export default UserUpdateAvatarService;
