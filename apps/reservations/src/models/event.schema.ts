import { CommonDocument } from '@app/common';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ optimisticConcurrency: true, })
export class EventDocument extends CommonDocument {
    @Prop({ default: 50 })
    tickets: number;

    @Prop({ default: 'active' })
    status: string;

    @Prop()
    price: number;

    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    imageUrl: string;
}

export const EventSchema =
    SchemaFactory.createForClass(EventDocument);

// EventSchema.pre('save', function (next) {
//     if (this.tickets === 0) this.status = "Inactive"
//     next();
// });
