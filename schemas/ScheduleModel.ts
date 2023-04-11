import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;
@Schema()
export class Schedule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
  @Prop({ required: true })
  day: Date;
  @Prop({ required: true })
  start: Date;
  @Prop({ required: true })
  end: Date;
  // slot duration for events
  @Prop({ required: true })
  duration: number;
  createdAt: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  events: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
