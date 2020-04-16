import { Router } from 'express';

import { appointmentsRouter } from './appointments.routes';

export const routes = Router();

routes.use('/appointments', appointmentsRouter);

export default routes;
