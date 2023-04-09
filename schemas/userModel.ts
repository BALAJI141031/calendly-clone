import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schedule } from './ScheduleModel';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  events: Event[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' })
  schedules: Schedule[];
}

export const UserSchema = SchemaFactory.createForClass(User);
