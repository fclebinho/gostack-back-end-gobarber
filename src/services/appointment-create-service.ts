import { startOfHour } from 'date-fns';

import Appointment from '../models/appointment';
import AppointmentRepository from '../repositories/appointment-repository';

export interface AppointmentRequestProps {
  provider: string;
  date: Date;
}

export class AppointmentCreateService {
  private repository: AppointmentRepository;

  constructor(repository: AppointmentRepository) {
    this.repository = repository;
  }

  public execute({ provider, date }: AppointmentRequestProps): Appointment {
    const parsedDate = startOfHour(date);
    const findAppointmentInSameDate = this.repository.findByDate(parsedDate);

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const appointment = this.repository.create({ provider, date: parsedDate });

    return appointment;
  }
}

export default AppointmentCreateService;
