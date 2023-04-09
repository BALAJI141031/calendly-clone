import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Schedule } from 'schemas/ScheduleModel';

@Injectable()
export class ScheduleDao {
  constructor(
    @InjectModel('Schedule') private scheduleModel: Model<Schedule>,
  ) {}
  async create(createCatDto: any): Promise<any> {
    const schedule = new this.scheduleModel(createCatDto);
    return schedule.save();
  }
}
