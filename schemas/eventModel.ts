import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;
@Schema()
export class Event {
  @Prop({ required: true })
  guestEmail: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  organiserId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' })
  scheduleId: string;

  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  day: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  summary?: string;
}
export const EventSchema = SchemaFactory.createForClass(Event);
