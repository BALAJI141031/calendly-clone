import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({
    description: 'username',
    example: 'rohit sharma',
  })
  @Prop({ required: true })
  name: string;
  @ApiProperty({
    description: 'email',
    example: 'xyz@gmailcom',
  })
  @Prop({ required: true })
  email: string;

  @ApiProperty({
    description: 'ref ids',
    example: ['ascd12345621'],
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  events: Event[];

  @ApiProperty({
    description: 'ref ids',
    example: ['ascd12345621'],
  })
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }] })
  scheduleId: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
