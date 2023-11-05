import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class GetUserDto {
  @IsString()
  @IsNotEmpty()
  _id: string;
}
