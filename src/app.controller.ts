import { Controller, Post, Body } from '@nestjs/common';
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

  @Post('schedule')
  async createSchedule(@Body() createSchduleDto: any): Promise<any> {
    return this.appService.createSchedule(createSchduleDto);
  }
}
