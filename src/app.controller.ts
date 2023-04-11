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
import {
  CreateEventDto,
  CreateUserDto,
  ScheduleDto,
  GetTokenDto,
} from 'dao/dto';
import { Schedule } from 'schemas/ScheduleModel';
import { Event } from 'schemas/eventModel';
import { User } from 'schemas/userModel';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // api to create host schedule
  @Post('schedule')
  @ApiResponse({
    status: 201,
    description: 'created schedule',
    type: Schedule,
  })
  async createSchedule(
    @Body() createSchduleDto: ScheduleDto,
  ): Promise<ScheduleDto> {
    return this.appService.createSchedule(createSchduleDto);
  }
  // api to fetch host schedules
  @Get('user/schedules/:userId')
  @ApiResponse({
    status: 200,
    description: 'created schedules',
    type: [Schedule],
  })
  async getUserSchedules(@Param('userId') userId: string): Promise<Schedule[]> {
    return this.appService.getUserSchedules(userId);
  }

  // create event in calendar
  @Post('event')
  @ApiResponse({
    status: 201,
    description: 'created event',
    type: Event,
  })
  @HttpCode(201)
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<any> {
    return this.appService.createActalEvent(createEventDto);
  }

  // returns url for google authorization
  @Get('authUrl')
  @ApiResponse({
    status: 201,
    description: 'url to authorize',
    type: String,
  })
  async generateAuthUrl(): Promise<string> {
    return this.appService.generateAuthUrl();
  }

  @Get('tokens')
  @HttpCode(200)
  async getTokens(@Body() getTokenDto: GetTokenDto): Promise<any> {
    return this.appService.getTokens(getTokenDto);
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
  @ApiResponse({
    status: 201,
    description: 'created user',
    type: User,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.appService.create(createUserDto);
  }

  @Get('user/details/:userId')
  @ApiResponse({
    status: 201,
    description: 'user response',
    type: User,
  })
  async getUser(@Param('userId') userId: string): Promise<User> {
    return this.appService.getUserById(userId);
  }
}
