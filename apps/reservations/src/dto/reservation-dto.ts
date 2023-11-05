import { CardDto, CreateChargeDto } from '@app/common';
import { EventDto } from '@app/common/dto/event-dto';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsDefined,
    ValidateNested,
} from 'class-validator';

export class ReservationDto {
    @IsDefined()
    @IsNotEmpty()
    eventname: string

    @IsDefined()
    @IsNotEmpty()
    email: string

    @IsDefined()
    @IsNotEmpty()
    tickets: string

    @IsDefined()
    @IsNotEmpty()
    cardnumber: string

    @IsDefined()
    @IsNotEmpty()
    cardexpire: string

    @IsDefined()
    @IsNotEmpty()
    cardcvc: string
}
