import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import AppointmentCreateService from '../services/appointment-create-service';
import AppointmentRepository from '../repositories/appointment-repository';
import authenticated from '../middlewares/authenticate';

export const appointmentsRouter = Router();

appointmentsRouter.use(authenticated);

appointmentsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(AppointmentRepository);
  const appointments = await repository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);
  const service = new AppointmentCreateService();
  const appointment = await service.execute({
    provider_id,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
