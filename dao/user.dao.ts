import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'schemas/userModel';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly events?: string[]; // Optional field
  readonly schedules?: string[]; // Optional field
}
@Injectable()
export class UserDao {
  constructor(@InjectModel('User') private userModel: Model<User>) {}
  async create(createCatDto: CreateUserDto): Promise<any> {
    const createdCat = new this.userModel(createCatDto);
    return createdCat.save();
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: new Types.ObjectId(userId) })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }
}
