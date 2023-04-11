import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ScheduleDocument = HydratedDocument<Schedule>;
@Schema()
export class Schedule {
  @ApiProperty({
    description: 'user id',
    example: '12345678',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;
  @ApiProperty({
    description: 'day',
    example: Date(),
  })
  @Prop({ required: true })
  day: Date;
  @ApiProperty({
    description: 'start time',
    example: Date(),
  })
  @Prop({ required: true })
  start: Date;
  @ApiProperty({
    description: 'end time',
    example: Date(),
  })
  @Prop({ required: true })
  end: Date;
  @ApiProperty({
    description: 'duration',
    example: 30,
  })
  // slot duration for events
  @Prop({ required: true })
  duration: number;
  @ApiProperty({
    description: 'created at time',
    example: Date(),
  })
  createdAt: Date;
  @ApiProperty({
    description: 'events array',
    example: '[1123444]',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  events: string[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
