import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { UserDocument } from './models/user.schema';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(UserDocument.name)
    userModel: Model<UserDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(userModel, connection);
  }
}
