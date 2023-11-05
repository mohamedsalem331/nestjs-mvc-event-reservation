import { CommonDocument } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({ optimisticConcurrency: true, })
export class ReservationDocument extends CommonDocument {
  @Prop()
  timestamp: Date;

  @Prop()
  userId: string;

  @Prop()
  invoiceId: string;

  @Prop()
  eventId: string;

  @Prop({ default: 1 })
  tickets: number;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);

// ReservationSchema.pre('save', function (next) {
//   this.updateOne({}, { $inc: { __v: 1 } });
//   next();
// });
