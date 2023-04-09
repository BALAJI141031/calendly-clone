import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScheduleDocument = HydratedDocument<Schedule>;
@Schema()
export class Schedule {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;
  @Prop({ required: true })
  day: string;
  @Prop({ required: true })
  start: Date;
  @Prop({ required: true })
  end: Date;
  @Prop({ required: true })
  duration: number;
  createdAt: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  events: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
