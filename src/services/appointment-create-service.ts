import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import { ApplicationError } from '../errors/application-error';
import Appointment from '../models/appointment';
import AppointmentRepository from '../repositories/appointment-repository';

export interface AppointmentRequestProps {
  provider_id: string;
  date: Date;
}

export class AppointmentCreateService {
  public async execute({
    provider_id,
    date,
  }: AppointmentRequestProps): Promise<Appointment> {
    const repository = getCustomRepository(AppointmentRepository);

    const parsedDate = startOfHour(date);
    const findAppointmentInSameDate = await repository.findByDate(parsedDate);

    if (findAppointmentInSameDate) {
      throw new ApplicationError('This appointment is already booked');
    }

    const appointment = repository.create({ provider_id, date: parsedDate });

    await repository.save(appointment);

    return appointment;
  }
}

export default AppointmentCreateService;
