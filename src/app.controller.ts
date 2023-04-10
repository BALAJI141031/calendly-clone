import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    description: 'name of the user',
    example: 'virat Kohli',
  })
  readonly name: string;
  readonly email: string;
  readonly events?: string[];
  readonly schedules?: string[];
}
export class CreateEventDto {
  @ApiProperty({
    description: 'name of the user',
    example: 'virat Kohli',
  })
  readonly guestEmail: string;
  readonly organiserId: string;
  readonly scheduleId: string;
  readonly title: string;
  readonly day: string;
  readonly startTime: Date;
  readonly endTime: Date;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('user')
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.appService.create(createUserDto);
  }

  @Get('user/details/:userId')
  async getUser(@Param('userId') userId: string): Promise<any> {
    return this.appService.getUserById(userId);
  }

  @Post('schedule')
  async createSchedule(@Body() createSchduleDto: any): Promise<any> {
    return this.appService.createSchedule(createSchduleDto);
  }

  @Get('user/schedules/:userId')
  async getUserSchedules(@Param('userId') userId: string): Promise<any> {
    return this.appService.getUserSchedules(userId);
  }

  @Post('event')
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<any> {
    console.log('event called');
    return this.appService.createEvent(createEventDto);
  }
  @Post('eventCreds')
  async getCreds(): Promise<any> {
    console.log('event called');
    // return this.appService.createEvent(createEventDto);
  }
}
