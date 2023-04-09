import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;
@Schema()
export class Event {
  @Prop({ required: true })
  organiser: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  organiserId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' })
  scheduleId: string;

  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  day: Date;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;
}
export const EventSchema = SchemaFactory.createForClass(Event);
