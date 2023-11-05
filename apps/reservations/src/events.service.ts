import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, flatMap, lastValueFrom, map, mergeMap, of, } from 'rxjs';
import { EventsRepository } from './events.repository';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    @InjectConnection() private connection: Connection,
  ) { }
  // async create(user: UserDto) {
  //   const session = await this.connection.startSession()
  //   session.startTransaction()

  //   try {

  //     await session.commitTransaction();
  //     return []

  //   } catch (error) {
  //     await session.abortTransaction();
  //   } finally {
  //     await session.endSession();
  //   }

  // }

  async findAll() {
    return this.eventsRepository.findAll({});
  }

  async findOne(_id: string) {
    return this.eventsRepository.findOne({ _id });
  }

  async updateOne(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.eventsRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }


}







