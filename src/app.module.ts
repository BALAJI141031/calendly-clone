import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDao } from '../dao/user.dao';
import { UserSchema } from '../schemas/userModel';
import { ScheduleSchema } from '../schemas/ScheduleModel';
import { EventSchema } from '../schemas/eventModel';
import { ScheduleDao } from '../dao/schedule.dao';
import { EventsDao } from '../dao/events.dao';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Schedule', schema: ScheduleSchema },
      { name: 'Event', schema: EventSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, UserDao, ScheduleDao, EventsDao],
})
export class AppModule {}
