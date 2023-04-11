import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule } from '../schemas/ScheduleModel';

@Injectable()
export class ScheduleDao {
  constructor(
    @InjectModel('Schedule') private scheduleModel: Model<Schedule>,
  ) {}
  async create(scheduleDto: any): Promise<any> {
    const schedule = new this.scheduleModel(scheduleDto);
    return schedule.save();
  }
  async getSchedule(query: any): Promise<Schedule> {
    try {
      return this.scheduleModel.findOne(query).exec();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async getSchedules(userId: string): Promise<Schedule[]> {
    try {
      return this.scheduleModel.find({ userId }).exec();
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
