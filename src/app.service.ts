import { Inject, Injectable, ForbiddenException } from '@nestjs/common';
import { UserDao } from '../dao/user.dao';
import { ScheduleDao } from 'dao/scheduleDao';
import { User } from 'schemas/userModel';
import { Schedule } from 'schemas/ScheduleModel';
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
    const { userId, day } = createScheduleDto;
    const user = await this.userDao.getUserById(userId);
    const schedule = await this.scheduleDao.getSchedule({ userId, day });

    if (schedule) {
      throw new ForbiddenException('Schedule already exists');
    }
    const scheduleResp = await this.scheduleDao.create(createScheduleDto);
    const updatedSchedules = [...(user?.scheduleId || []), scheduleResp._id];
    const updatedUser = await this.userDao.updateUser(userId, {
      scheduleId: updatedSchedules,
    });

    return updatedUser;
  }
  async getUserSchedules(userId: string): Promise<Schedule[]> {
    return await this.scheduleDao.getSchedules(userId);
  }
}
