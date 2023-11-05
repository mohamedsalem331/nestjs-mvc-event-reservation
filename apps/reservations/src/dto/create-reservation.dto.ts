import { CardDto, CreateChargeDto } from '@app/common';
import { EventDto } from '@app/common/dto/event-dto';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsDefined,
  ValidateNested,
} from 'class-validator';

export class CreateReservationDto {
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;

  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => EventDto)
  event: EventDto;
}
