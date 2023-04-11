import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from '../schemas/eventModel';

@Injectable()
export class EventsDao {
  constructor(@InjectModel('Event') private eventModel: Model<Event>) {}
  async create(eventDto: any) {
    const schedule = new this.eventModel(eventDto);
    return schedule.save();
  }

  async findEvent(query: any) {
    return await this.eventModel.findOne(query);
  }
}
