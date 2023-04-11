import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type EventDocument = HydratedDocument<Event>;
@Schema()
export class Event {
  @ApiProperty({
    description: 'schedule id',
    example: 'xyz@gmail.com',
  })
  @Prop({ required: true })
  guestEmail: string;

  @ApiProperty({
    description: 'schedule id',
    example: '11235544',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  organiserId: string;

  @ApiProperty({
    description: 'schedule id',
    example: 'helloworld',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' })
  scheduleId: string;

  @ApiProperty({
    description: 'title',
    example: 'helloworld',
  })
  @Prop({ required: true })
  title: string;

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
  startTime: Date;

  @ApiProperty({
    description: 'end time',
    example: Date(),
  })
  @Prop({ required: true })
  endTime: Date;
}
export const EventSchema = SchemaFactory.createForClass(Event);
