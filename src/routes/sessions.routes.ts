import { Router } from 'express';

import { SessionCreateService } from '../services/session-create-service';

export const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const service = new SessionCreateService();

  const { user, token } = await service.execute({ email, password });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
