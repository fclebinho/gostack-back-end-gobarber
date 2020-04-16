import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import { UserCreateService } from '../services/user-create-service';
import { UserUpdateAvatarService } from '../services/user-update-avatar-service';
import { authenticated } from '../middlewares/authenticate';

export const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const service = new UserCreateService();
  const user = await service.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  '/avatar',
  authenticated,
  upload.single('avatar'),
  async (request, response) => {
    const service = new UserUpdateAvatarService();

    const user = await service.execute({
      user_id: request.user.id,
      avatar_file_name: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  },
);

export default usersRouter;
