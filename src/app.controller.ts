import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Headers,
  HttpCode,
} from '@nestjs/common';
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

  // api to create host schedule
  @Post('schedule')
  @HttpCode(201)
  async createSchedule(@Body() createSchduleDto: any): Promise<any> {
    return this.appService.createSchedule(createSchduleDto);
  }
  // api to fetch host schedules
  @Get('user/schedules/:userId')
  @HttpCode(200)
  async getUserSchedules(@Param('userId') userId: string): Promise<any> {
    return this.appService.getUserSchedules(userId);
  }

  // create event in calendar
  @Post('event')
  @HttpCode(201)
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<any> {
    return this.appService.createActalEvent(createEventDto);
  }

  // returns url for google authorization
  @Get('authUrl')
  @HttpCode(200)
  async getCreds(): Promise<any> {
    return this.appService.generateAuthUrl();
  }

  // refresh access token
  @Post('/refresh-token')
  @HttpCode(200)
  async refreshAccessToken(
    @Headers('authorization') authorizationHeader: string,
  ) {
    try {
      const expiredAccessToken = authorizationHeader.split(' ')[1];
      const newAccessToken = await this.appService.refreshAccessToken(
        expiredAccessToken,
      );
      return newAccessToken;
    } catch (error) {
      throw error;
    }
  }

  @Post('user')
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.appService.create(createUserDto);
  }

  @Get('user/details/:userId')
  @HttpCode(200)
  async getUser(@Param('userId') userId: string): Promise<any> {
    return this.appService.getUserById(userId);
  }
}
