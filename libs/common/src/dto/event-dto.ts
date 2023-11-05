import {
    IsDefined,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from 'class-validator';

export class EventDto {
    @IsNotEmpty()
    @IsNumber()
    tickets: number;

    @IsDefined()
    @IsNotEmpty()
    @IsString()
    eventId: string;
}
