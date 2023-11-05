import { AbstractRepository } from '@app/common';
import { ReservationDocument } from './models/reservation.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationDocument> {
  protected readonly logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectModel(ReservationDocument.name)
    reservationModel: Model<ReservationDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(reservationModel, connection);
  }
}
