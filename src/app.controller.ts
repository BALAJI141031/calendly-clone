import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AppService } from './app.service';
export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly events?: string[];
  readonly schedules?: string[];
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
}
