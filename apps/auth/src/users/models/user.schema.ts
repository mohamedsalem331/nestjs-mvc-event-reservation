import { CommonDocument } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ optimisticConcurrency: true })
export class UserDocument extends CommonDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

// UserSchema.pre('save', function (next) {
//   this.updateOne({}, { $inc: { __v: 1 } });
//   next();
// });
