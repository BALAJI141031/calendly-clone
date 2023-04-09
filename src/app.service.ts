import { Inject, Injectable } from '@nestjs/common';
import { UserDao } from '../dao/user.dao';
import { ScheduleDao } from 'dao/scheduleDao';
import { User } from 'schemas/userModel';
export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly events?: string[]; // Optional field
  readonly schedules?: string[]; // Optional field
}
@Injectable()
export class AppService {
  @Inject()
  private userDao: UserDao;

  @Inject()
  private scheduleDao: ScheduleDao;
  async create(createUserDto: CreateUserDto): Promise<any> {
    return await this.userDao.create(createUserDto);
  }
  async getUserById(userId: string): Promise<User> {
    return await this.userDao.getUserById(userId);
  }
  async createSchedule(createScheduleDto: any): Promise<any> {
    const { userId } = createScheduleDto;
    const user = await this.userDao.getUserById(userId);
    return await this.scheduleDao.create(createScheduleDto);
  }
}
