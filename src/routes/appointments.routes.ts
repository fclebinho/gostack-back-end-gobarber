import { Router, Request, Response } from 'express';
import { parseISO } from 'date-fns';

import AppointmentCreateService from '../services/appointment-create-service';
import AppointmentRepository from '../repositories/appointment-repository';

export const appointmentsRouter = Router();
const repository = new AppointmentRepository();

appointmentsRouter.get('/', (request: Request, response: Response) => {
  const appointments = repository.all();

  return response.json(appointments);
});

appointmentsRouter.post('/', (request: Request, response: Response) => {
  try {
    const { provider, date } = request.body;

    const parsedDate = parseISO(date);
    const service = new AppointmentCreateService(repository);
    const appointment = service.execute({ provider, date: parsedDate });

    return response.json(appointment);
  } catch (e) {
    return response.status(400).json({ error: e.message });
  }
});

export default appointmentsRouter;
