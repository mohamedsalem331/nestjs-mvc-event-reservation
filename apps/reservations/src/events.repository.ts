import { AbstractRepository } from '@app/common';
import { ReservationDocument } from './models/reservation.schema';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, FilterQuery, Model, Types, UpdateQuery, SaveOptions, HydratedDocument } from 'mongoose';
import { EventDocument } from './models/event.schema';
import { EventDto } from '@app/common/dto/event-dto';

@Injectable()
export class EventsRepository extends AbstractRepository<EventDocument> {
    protected readonly logger = new Logger(EventsRepository.name);

    constructor(
        @InjectModel(EventDocument.name)
        private readonly eventModel: Model<EventDocument>,
        @InjectConnection() connection: Connection,
    ) {
        super(eventModel, connection);
    }

    async updateEventTicket(
        filterQuery: FilterQuery<EventDocument>,
        update: UpdateQuery<EventDocument>,
        eventData: EventDto,
        options?: SaveOptions,
    ): Promise<any> {
        try {
            const document = await this.eventModel.findOne(filterQuery).session(options.session)

            if (!document) {
                this.logger.warn('Document not found with filterquery -> ', filterQuery);
                throw new NotFoundException('Document not found');
            }

            if (document.tickets < eventData.tickets) {
                throw new BadRequestException('The number of tickets is unavailable');
            }

            document.tickets = Number(document.tickets) - Number(eventData.tickets)

            await document.save(options)

            console.log(`Tickets Available: ${document.tickets} Tickets Reserved: ${eventData.tickets}`);

            return document
        } catch (error) {
            console.log('error-repo', error);
            throw error
        }
    }
}
