import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class UserDto {
  @IsString()
  _id: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
