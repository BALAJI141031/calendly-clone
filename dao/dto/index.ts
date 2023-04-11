import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEmail } from 'class-validator';
import { Types } from 'mongoose';
export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'Virat Kohli',
  })
  readonly name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'virat.kohli@example.com',
  })
  readonly email: string;

  @ApiProperty({
    description: 'Events associated with the user',
    type: [String],
    required: false,
  })
  readonly events?: string[];

  @ApiProperty({
    description: 'Schedules associated with the user',
    type: [String],
    required: false,
  })
  readonly schedules?: string[];
}
export class CreateEventDto {
  @ApiProperty({
    description: 'Email of the guest',
    example: 'example@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly guestEmail: string;

  @ApiProperty({
    description: 'ID of the organiser',
    example: '12345',
  })
  @IsNotEmpty()
  readonly organiserId: string;

  @ApiProperty({
    description: 'ID of the schedule',
    example: '67890',
  })
  @IsNotEmpty()
  readonly scheduleId: string;

  @ApiProperty({
    description: 'Title of the event',
    example: 'Meeting with John',
  })
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({
    description: 'Day of the event',
    example: '2023-04-13',
  })
  @IsNotEmpty()
  readonly day: string;

  @ApiProperty({
    description: 'Start time of the event',
    example: '2023-04-13T09:00:00Z',
  })
  @IsNotEmpty()
  readonly startTime: Date;

  @ApiProperty({
    description: 'End time of the event',
    example: '2023-04-13T10:00:00Z',
  })
  @IsNotEmpty()
  readonly endTime: Date;
}

export class ScheduleDto {
  @ApiProperty({
    type: String,
    description: 'User Id',
  })
  @IsNotEmpty()
  readonly userId: string;

  @ApiProperty({
    type: String,
    description: 'Day',
  })
  @IsNotEmpty()
  @IsString()
  readonly day: string;

  @ApiProperty({
    type: Date,
    description: 'Start time of the schedule',
  })
  @IsNotEmpty()
  readonly start: Date;

  @ApiProperty({
    type: Date,
    description: 'End time of the schedule',
  })
  @IsNotEmpty()
  readonly end: Date;

  @ApiProperty({
    type: Number,
    description: 'Duration of each slot in minutes',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly duration: number;

  @ApiProperty({
    type: Date,
    description: 'Creation date of the schedule',
  })
  readonly createdAt: Date;

  @ApiProperty({
    type: [String],
    description: 'List of event ids for this schedule',
  })
  readonly events: Types.ObjectId[];
}
