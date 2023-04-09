import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'schemas/userModel';
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
}
