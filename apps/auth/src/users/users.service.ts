import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './users.repository';
import { comparePass, hassPass } from '../utils/bcrypt.util';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) { }
  async create(createUserDto: CreateUserDto) {
    await this._validateCreateUserDto(createUserDto);

    return this.usersRepository.create({
      ...createUserDto,
      password: await hassPass(createUserDto.password),
    });
  }

  private async _validateCreateUserDto(createUserDto: CreateUserDto) {
    const userExists = await this.usersRepository.findOne({
      email: createUserDto.email,
    });
    if (userExists) throw new BadRequestException('User Already Exists');
    return;
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });

    const passwordIsValid = await comparePass(password, user.password);
    if (!passwordIsValid)
      throw new UnauthorizedException('Credentials are not valid');
    return user;
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);

  }
}
